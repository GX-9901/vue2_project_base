<template>
  <Dialog title="选择规格" :visible.sync="visible">
    <el-radio-group
      v-model="selectSku"
      @input="success"
      class="sku-table-radio"
    >
      <el-table v-loading="loading" :data="list" row-key="id">
        <el-table-column label="#" width="60">
          <template v-slot="{ row }">
            <el-radio :label="row"><span></span></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="商品图" align="center">
          <template v-slot="{ row }">
            <el-image class="sku-table-img" :src="row.picUrl"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="规格" align="center">
          <template v-slot="{ row }">
            {{ row.properties[0].valueName }}
          </template>
        </el-table-column>
        <el-table-column label="销售价(元)" align="center">
          <template v-slot="{ row }">
            {{ fenToYuan(row.costPrice) }}
          </template>
        </el-table-column>
      </el-table>
    </el-radio-group>
  </Dialog>
</template>

<script>
import * as ProductSpuApi from "@/api/mall/product/spu";
import { fenToYuan } from "@/utils";

export default {
  name: "SkuTableSelect",
  props: {
    spuId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      visible: false,
      list: [],
      selectSku: null,
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    async getSpuDetail() {
      this.loading = true;
      try {
        const { data } = await ProductSpuApi.getSpuDetail(this.spuId);
        this.list = data.skus;
      } finally {
        this.loading = false;
      }
    },
    success(val) {
      this.visible = false;
      this.$emit("success", val);
    },
    fenToYuan,
  },
  watch: {
    spuId(spuId) {
      if (spuId) {
        this.getSpuDetail();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.sku-table-radio {
  width: 100%;
}
.sku-table-img {
  width: 50px;
  height: 50px;
}
</style>
