<template>
  <el-table :data="spuData" :expand-row-keys="expandRowKeys" row-key="id">
    <el-table-column type="expand" width="30">
      <template #default="{ row }">
        <SkuList
          ref="skuListRef"
          :is-activity-component="true"
          :prop-form-data="
            spuPropertyList.find((item) => item.spuId === row.id)?.spuDetail
          "
          :property-list="
            spuPropertyList.find((item) => item.spuId === row.id)?.propertyList
          "
          :rule-config="ruleConfig"
        >
          <template #extension>
            <slot></slot>
          </template>
        </SkuList>
      </template>
    </el-table-column>
    <el-table-column key="id" align="center" label="商品编号" prop="id" />
    <el-table-column label="商品图" min-width="80">
      <template #default="{ row }">
        <el-image
          :src="row.picUrl"
          class="h-30px w-30px"
          @click="imagePreview(row.picUrl)"
        />
      </template>
    </el-table-column>
    <el-table-column
      :show-overflow-tooltip="true"
      label="商品名称"
      min-width="300"
      prop="name"
    />
    <el-table-column
      align="center"
      label="商品售价"
      min-width="90"
      prop="price"
    >
      <template #default="{ row }">
        {{ formatToFraction(row.price) }}
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      label="销量"
      min-width="90"
      prop="salesCount"
    />
    <el-table-column align="center" label="库存" min-width="90" prop="stock" />
  </el-table>
</template>

<script>
import { formatToFraction } from "@/utils";
// import { createImageViewer } from "@/components/ImageViewer";
import { Spu } from "@/api/mall/product/spu";
import { RuleConfig, SkuList } from "@/views/mall/product/spu/components";

export default {
  name: "PromotionSpuAndSkuList",
  props: {
    spuList: Array,
    ruleConfig: Array,
    spuPropertyListP: Array,
  },
  data() {
    return {
      spuData: [], // spu 详情数据列表
      spuPropertyList: [], // spuId 对应的 sku 的属性列表
      expandRowKeys: [], // 控制展开行需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
    };
  },
  methods: {
    /**
     * 获取所有 sku 活动配置
     *
     * @param extendedAttribute 在 sku 上扩展的属性，例：秒杀活动 sku 扩展属性 productConfig 请参考 seckillActivity.js
     */
    getSkuConfigs(extendedAttribute) {
      this.$refs.skuListRef.validateSku();
      const seckillProducts = [];
      this.spuPropertyList.forEach((item) => {
        item.spuDetail.skus.forEach((sku) => {
          seckillProducts.push(sku[extendedAttribute]);
        });
      });
      return seckillProducts;
    },
    /** 商品图预览 */
    imagePreview(imgUrl) {
      // createImageViewer({
      //   zIndex: 99999999,
      //   urlList: [imgUrl],
      // });
    },
  },
  watch: {
    /**
     * 将传进来的值赋值给 skuList
     */
    spuList: {
      handler(data) {
        if (!data) return;
        this.spuData = data;
      },
      deep: true,
      immediate: true,
    },
    /**
     * 将传进来的值赋值给 skuList
     */
    spuPropertyListP: {
      handler(data) {
        if (!data) return;
        this.spuPropertyList = data;
        // 解决如果之前选择的是单规格 spu 的话后面选择多规格 sku 多规格属性信息不展示的问题。解决方法：让 SkuList 组件重新渲染（行折叠会干掉包含的组件展开时会重新加载）
        setTimeout(() => {
          this.expandRowKeys = data.map((item) => item.spuId);
        }, 200);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
