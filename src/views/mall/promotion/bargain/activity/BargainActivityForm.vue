<template>
  <div>
    <Dialog :visible.sync="dialogVisible" :title="dialogTitle" width="65%">
      <Form
        ref="formRef"
        v-loading="formLoading"
        :is-col="true"
        :rules="rules"
        class="mt-10px"
      >
        <template #spuId>
          <el-button @click="spuSelectRef.open()">选择商品</el-button>
          <SpuAndSkuList
            ref="spuAndSkuListRef"
            :rule-config="ruleConfig"
            :spu-list="spuList"
            :spu-property-list-p="spuPropertyList"
          >
            <el-table-column
              align="center"
              label="砍价起始价格(元)"
              min-width="168"
            >
              <template #default="{ row: sku }">
                <el-input-number
                  v-model="sku.productConfig.bargainFirstPrice"
                  :min="0"
                  :precision="2"
                  :step="0.1"
                  class="w-100%"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="砍价底价(元)"
              min-width="168"
            >
              <template #default="{ row: sku }">
                <el-input-number
                  v-model="sku.productConfig.bargainMinPrice"
                  :min="0"
                  :precision="2"
                  :step="0.1"
                  class="w-100%"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" label="活动库存" min-width="168">
              <template #default="{ row: sku }">
                <el-input-number
                  v-model="sku.productConfig.stock"
                  class="w-100%"
                />
              </template>
            </el-table-column>
          </SpuAndSkuList>
        </template>
      </Form>
      <template #footer>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          确 定
        </el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </Dialog>
    <SpuSelect
      ref="spuSelectRef"
      :isSelectSku="true"
      :radio="true"
      @confirm="selectSpu"
    />
  </div>
</template>
<script>
import * as BargainActivityApi from "@/api/mall/promotion/bargainActivity";
import { rules } from "./bargainActivity.data";
import { SpuAndSkuList, SpuSelect } from "@/views/mall/promotion/components";
import { getPropertyList } from "@/views/mall/product/spu/components";
import * as ProductSpuApi from "@/api/mall/product/spu";
import { convertToInteger, formatToFraction } from "@/utils";
import { cloneDeep } from "lodash-es";

export default {
  name: "PromotionBargainActivityForm",
  components: {
    SpuSelect,
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: "",
      formLoading: false,
      formType: "",
      spuList: [],
      spuPropertyList: [],
      ruleConfig: [
        {
          name: "productConfig.bargainFirstPrice",
          rule: (arg) => arg > 0,
          message: "商品砍价起始价格不能小于 0 ！！！",
        },
        {
          name: "productConfig.bargainMinPrice",
          rule: (arg) => arg >= 0,
          message: "商品砍价底价不能小于 0 ！！！",
        },
        {
          name: "productConfig.stock",
          rule: (arg) => arg >= 1,
          message: "商品活动库存不能小于 1 ！！！",
        },
      ],
      rules,
    };
  },
  methods: {
    selectSpu(spuId, skuIds) {
      this.$refs.formRef.setValues({ spuId });
      this.getSpuDetails(spuId, skuIds);
    },
    /**
     * 获取 SPU 详情
     */
    async getSpuDetails(spuId, skuIds, products) {
      const spuProperties = [];
      const { data: res } = await ProductSpuApi.getSpuDetailList([spuId]);
      if (res.length == 0) {
        return;
      }
      this.spuList = [];
      // 因为只能选择一个
      const spu = res[0];
      const selectSkus =
        typeof skuIds === "undefined"
          ? spu?.skus
          : spu?.skus?.filter((sku) => skuIds.includes(sku.id));
      selectSkus?.forEach((sku) => {
        let config = {
          spuId: spu.id,
          skuId: sku.id,
          bargainFirstPrice: 1,
          bargainMinPrice: 1,
          stock: 1,
        };
        if (typeof products !== "undefined") {
          const product = products.find((item) => item.skuId === sku.id);
          if (product) {
            product.bargainFirstPrice = formatToFraction(
              product.bargainFirstPrice,
            );
            product.bargainMinPrice = formatToFraction(product.bargainMinPrice);
          }
          config = product || config;
        }
        sku.productConfig = config;
      });
      spu.skus = selectSkus;
      spuProperties.push({
        spuId: spu.id,
        spuDetail: spu,
        propertyList: getPropertyList(spu),
      });
      this.spuList.push(spu);
      this.spuPropertyList = spuProperties;
    },
    /** 打开弹窗 */
    async open(type, id) {
      this.dialogVisible = true;
      this.dialogTitle = type === "create" ? "添加" : "修改";
      this.formType = type;
      await this.resetForm();
      // 修改时，设置数据
      if (id) {
        this.formLoading = true;
        try {
          const { data } = await BargainActivityApi.getBargainActivity(id);
          // 用户每次砍价金额分转元, 分转元
          data.randomMinPrice = formatToFraction(data.randomMinPrice);
          data.randomMaxPrice = formatToFraction(data.randomMaxPrice);
          // 对齐活动商品处理结构
          await getSpuDetails(
            data.spuId,
            [data.skuId],
            [
              {
                spuId: data.spuId,
                skuId: data.skuId,
                bargainFirstPrice: data.bargainFirstPrice, // 砍价起始价格，单位分
                bargainMinPrice: data.bargainMinPrice, // 砍价底价
                stock: data.stock, // 活动库存
              },
            ],
          );
          this.$refs.formRef.setValues(data);
        } finally {
          this.formLoading = false;
        }
      }
    },
    /** 重置表单 */
    async resetForm() {
      this.spuList = [];
      this.spuPropertyList = [];
      await this.$nextTick();
      this.$refs.formRef.getElFormRef().resetFields();
    },
    /** 提交表单 */
    async submitForm() {
      // 校验表单
      if (!this.$refs.formRef) return;
      const valid = await this.$refs.formRef.getElFormRef().validate();
      if (!valid) return;
      // 提交请求
      this.formLoading = true;
      try {
        const data = cloneDeep(this.$refs.formRef.formModel);
        const products =
          this.$refs.spuAndSkuListRef.getSkuConfigs("productConfig");
        products.forEach((item) => {
          // 砍价价格元转分
          item.bargainFirstPrice = convertToInteger(item.bargainFirstPrice);
          item.bargainMinPrice = convertToInteger(item.bargainMinPrice);
        });
        // 用户每次砍价金额分转元, 元转分
        data.randomMinPrice = convertToInteger(data.randomMinPrice);
        data.randomMaxPrice = convertToInteger(data.randomMaxPrice);
        const formData = { ...data, ...products[0] };
        if (this.formType === "create") {
          await BargainActivityApi.createBargainActivity(this.formData);
          this.$message.success("添加成功");
        } else {
          await BargainActivityApi.updateBargainActivity(this.formData);
          this.$message.success("修改成功");
        }
        this.dialogVisible = false;
        // 发送操作成功的事件
        this.$emit("success");
      } finally {
        this.formLoading = false;
      }
    },
  },
};
</script>
