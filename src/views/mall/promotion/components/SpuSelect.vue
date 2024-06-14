<template>
  <Dialog
    :visible.sync="dialogVisible"
    :appendToBody="true"
    :title="dialogTitle"
    width="70%"
  >
    <el-card shadow="never" class="mb16">
      <el-row :gutter="20" class="mb-10px">
        <el-col :span="6">
          <el-input
            v-model="queryParams.name"
            class="!w-240px"
            clearable
            placeholder="请输入商品名称"
            @keyup.enter="handleQuery"
          />
        </el-col>
        <el-col :span="6">
          <el-tree-select
            v-model="queryParams.categoryId"
            :data="categoryList"
            :props="defaultProps"
            check-strictly
            class="w-1/1"
            node-key="id"
            placeholder="请选择商品分类"
          />
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="queryParams.createTime"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-240px"
            end-placeholder="结束日期"
            start-placeholder="开始日期"
            type="daterange"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-col>
        <el-col :span="6">
          <el-button @click="handleQuery">
            <Icon class="mr-5px" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon class="mr-5px" icon="ep:refresh" />
            重置
          </el-button>
        </el-col>
      </el-row>
      <el-table
        ref="spuListRef"
        v-loading="loading"
        :data="list"
        :expand-row-keys="expandRowKeys"
        row-key="id"
        @expand-change="expandChange"
        @selection-change="selectSpu"
      >
        <el-table-column v-if="isSelectSku" type="expand" width="30">
          <template #default>
            <SkuList
              v-if="isExpand"
              ref="skuListRef"
              :isComponent="true"
              :isDetail="true"
              :prop-form-data="spuData"
              :property-list="propertyList"
              @selection-change="selectSku"
            />
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" />
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
        <el-table-column
          align="center"
          label="库存"
          min-width="90"
          prop="stock"
        />
        <el-table-column
          align="center"
          label="排序"
          min-width="70"
          prop="sort"
        />
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          label="创建时间"
          prop="createTime"
          width="180"
        />
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNo"
        :total="total"
        @pagination="getList"
      />
    </el-card>
    <template #footer>
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script>
import {
  getPropertyList,
  PropertyAndValues,
  SkuList,
} from "@/views/mall/product/spu";
import { dateFormatter } from "@/utils/formatTime";
// import { createImageViewer } from "@/components/ImageViewer";
import { formatToFraction } from "@/utils";
import { defaultProps, handleTree } from "@/utils/tree";

import * as ProductCategoryApi from "@/api/mall/product/category";
import * as ProductSpuApi from "@/api/mall/product/spu";

export default {
  name: "PromotionSpuSelect",
  props: {
    // 默认不需要（不需要的情况下只返回 spu，需要的情况下返回 选中的 spu 和 sku 列表）
    // 其它活动需要选择商品和商品属性导入此组件即可，需添加组件属性 :isSelectSku='true'
    // 是否需要选择 sku 属性
    isSelectSku: {
      type: Boolean,
      default: false,
    },
    // 是否单选 sku
    radio: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      total: 0,
      list: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: "",
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        tabType: 0, // 默认获取上架的商品
        name: "",
        categoryId: null,
        createTime: [],
      },
      propertyList: [], // 商品属性列表
      spuData: {}, // 商品详情
      isExpand: false, // 控制 SKU 列表显示
      expandRowKeys: [], // 控制展开行需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
      //============ 商品选择相关 ============
      selectedSpuId: 0, // 选中的商品 spuId
      selectedSkuIds: [], // 选中的商品 skuIds
      categoryList: [], // 分类树
      defaultProps,
    };
  },
  methods: {
    dateFormatter,
    formatToFraction,
    selectSku(val) {
      const skuTable = this.$refs.skuListRef?.getSkuTableRef();
      if (this.selectedSpuId === 0) {
        this.$message.warning("请先选择商品再选择相应的规格！！！");
        this.$refs.skuTable?.clearSelection();
        return;
      }
      if (val.length === 0) {
        this.selectedSkuIds = [];
        return;
      }
      if (this.radio) {
        // 只选择一个
        this.selectedSkuIds = [val.map((sku) => sku.id)[0]];
        // 如果大于1个
        if (val.length > 1) {
          // 清空选择
          this.$refs.skuTable?.clearSelection();
          // 变更为最后一次选择的
          this.$refs.skuTable?.toggleRowSelection(val.pop(), true);
          return;
        }
      } else {
        this.selectedSkuIds = val.map((sku) => sku.id);
      }
    },
    selectSpu(val) {
      if (val.length === 0) {
        this.selectedSpuId = 0;
        return;
      }
      // 只选择一个
      this.selectedSpuId = val.map((spu) => spu.id)[0];
      // 切换选择 spu 如果有选择的 sku 则清空,确保选择的 sku 是对应的 spu 下面的
      if (this.selectedSkuIds.length > 0) {
        this.selectedSkuIds = [];
      }
      // 如果大于1个
      if (val.length > 1) {
        // 清空选择
        this.$refs.spuListRef?.clearSelection();
        // 变更为最后一次选择的
        this.$refs.spuListRef?.toggleRowSelection(val.pop(), true);
        return;
      }
      this.expandChange(val[0], val);
    },
    // 计算商品属性
    async expandChange(row, expandedRows) {
      // 判断需要展开的 spuId === 选择的 spuId。如果选择了 A 就展开 A 的 skuList。如果选择了 A 手动展开 B 则阻断
      // 目的防止误选 sku
      if (this.selectedSpuId !== 0) {
        if (row.id !== this.selectedSpuId) {
          this.$message.warning("你已选择商品请先取消");
          this.expandRowKeys = [this.selectedSpuId];
          return;
        }
        // 如果已展开 skuList 则选择此对应的 spu 不需要重新获取渲染 skuList
        if (this.isExpand && this.spuData?.id === row.id) {
          return;
        }
      }
      this.spuData = {};
      this.propertyList = [];
      this.isExpand = false;
      if (this.expandedRows?.length === 0) {
        // 如果展开个数为 0
        this.expandRowKeys = [];
        return;
      }
      // 获取 SPU 详情
      const { data } = await ProductSpuApi.getSpu(row.id);
      this.propertyList = this.getPropertyList(data);
      this.spuData = data;
      this.isExpand = true;
      this.expandRowKeys = [row.id];
    },

    /**
     * 确认选择返回选中的 spu 和 sku (如果需要选择sku的话)
     */
    confirm() {
      if (this.selectedSpuId === 0) {
        this.$message.warning("没有选择任何商品");
        return;
      }
      if (this.isSelectSku && this.selectedSkuIds.length === 0) {
        this.$message.warning("没有选择任何商品属性");
        return;
      }
      // 返回各自 id 列表
      this.isSelectSku
        ? this.$emits("confirm", this.selectedSpuId, this.selectedSkuIds)
        : this.$emits("confirm", this.selectedSpuId);
      // 关闭弹窗
      this.dialogVisible = false;
      this.selectedSpuId = 0;
      this.selectedSkuIds = [];
    },
    /** 打开弹窗 */
    open() {
      this.dialogTitle = "商品选择";
      this.dialogVisible = true;
    },
    /** 查询列表 */
    async getList() {
      this.loading = true;
      try {
        const { data } = await ProductSpuApi.getSpuPage(this.queryParams);
        this.list = data.list;
        this.total = data.total;
      } finally {
        this.loading = false;
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNo: 1,
        pageSize: 10,
        tabType: 0, // 默认获取上架的商品
        name: "",
        categoryId: null,
        createTime: [],
      };
      this.getList();
    },
    /** 商品图预览 */
    imagePreview(imgUrl) {
      // createImageViewer({
      //   zIndex: 99999999,
      //   urlList: [imgUrl],
      // });
    },
  },
  async mounted() {
    await this.getList();
    // 获得分类树
    const { data } = await ProductCategoryApi.getProductCategoryList({});
    this.categoryList = handleTree(data, "id", "parentId");
  },
};
</script>
