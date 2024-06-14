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
              label="拼团价格(元)"
              min-width="168"
            >
              <template #default="{ row: sku }">
                <el-input-number
                  v-model="sku.productConfig.combinationPrice"
                  :min="0"
                  :precision="2"
                  :step="0.1"
                  class="w-100%"
                />
              </template>
            </el-table-column>
          </SpuAndSkuList>
        </template>
      </Form>
      <template #footer>
        <el-button :disabled="formLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </Dialog>
    <SpuSelect ref="spuSelectRef" :isSelectSku="true" @confirm="selectSpu" />
  </div>
</template>
<script>
import * as CombinationActivityApi from "@/api/mall/promotion/combinationActivity";
import { rules } from "./combinationActivity.data";
import { SpuAndSkuList, SpuSelect } from "@/views/mall/promotion/components";
import { getPropertyList } from "@/views/mall/product/spu/components";
import * as ProductSpuApi from "@/api/mall/product/spu";
import { convertToInteger, formatToFraction } from "@/utils";
import { cloneDeep } from "lodash-es";

export default {
  name: "PromotionCombinationActivityForm",
  components: {
    SpuSelect,
    SpuAndSkuList,
  },
  data() {
    return {
      dialogVisible: false, // 弹窗的是否展示
      dialogTitle: "", // 弹窗的标题
      formLoading: false, // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formType: "", // 表单的类型：create - 新增；update - 修改
      // ================= 商品选择相关 =================
      spuList: [], // 选择的 spu
      spuPropertyList: [],
      ruleConfig: [
        {
          name: "productConfig.combinationPrice",
          rule: (arg) => arg >= 0.01,
          message: "商品拼团价格不能小于0.01 ！！！",
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
          combinationPrice: 0,
        };
        if (typeof products !== "undefined") {
          const product = products.find((item) => item.skuId === sku.id);
          if (product) {
            product.combinationPrice = formatToFraction(
              product.combinationPrice,
            );
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
          const { data } =
            await CombinationActivityApi.getCombinationActivity(id);
          await this.getSpuDetails(
            data.spuId,
            data.products?.map((sku) => sku.skuId),
            data.products,
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
        // 获得拼团商品配置
        const products = cloneDeep(
          this.$refs.spuAndSkuListRef.getSkuConfigs("productConfig"),
        );
        products.forEach((item) => {
          item.combinationPrice = convertToInteger(item.combinationPrice);
        });
        const data = cloneDeep(this.$refs.formRef.formModel);
        data.products = products;
        // 真正提交
        if (this.formType === "create") {
          await CombinationActivityApi.createCombinationActivity(data);
          this.$message.success("添加成功");
        } else {
          await CombinationActivityApi.updateCombinationActivity(data);
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
