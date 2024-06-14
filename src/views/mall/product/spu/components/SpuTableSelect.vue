<template>
  <Dialog title="选择商品" :visible.sync="visible" width="70%" append-to-body>
    <el-card shadow="never">
      <el-form inline>
        <el-form-item label="商品名称">
          <el-input placeholder="请输入商品名称" v-model="queryParams.name" />
        </el-form-item>
        <el-form-item label="商品分类">
          <TreeSelect
            :tree-data="categoryList"
            :defaultProps="{ id: 'id', label: 'name', children: 'children' }"
            v-model="queryParams.categoryId"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-DD HH:mm:ss"
            v-model="queryParams.createTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">
            搜索
          </el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-radio-group
        v-model="selectSpu"
        @input="success"
        class="sku-table-radio"
      >
        <el-table v-loading="loading" :data="list" row-key="id">
          <el-table-column label="#" width="60">
            <template v-slot="{ row }">
              <el-radio :label="row"><span></span></el-radio>
            </template>
          </el-table-column>
          <el-table-column label="商品编号" prop="id" align="center">
          </el-table-column>
          <el-table-column label="商品图" align="center">
            <template v-slot="{ row }">
              <el-image class="sku-table-img" :src="row.picUrl"></el-image>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            prop="name"
            align="center"
            width="450"
          />
          <el-table-column
            label="商品分类"
            prop="categoryName"
            align="center"
          />
        </el-table>
      </el-radio-group>
      <!-- 分页组件 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
  </Dialog>
</template>

<script>
import { TreeSelect } from "@/components/TreeSelect";
import * as ProductCategoryApi from "@/api/mall/product/category";
import * as ProductSpuApi from "@/api/mall/product/spu";
import { handleTree } from "@/utils/tree";

export default {
  name: "SpuTableSelect",
  components: {
    TreeSelect,
  },
  data() {
    return {
      visible: false,
      originCategoryList: [],
      categoryList: [],
      loading: true,
      list: [],
      total: 0,
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        // 默认获取上架的商品
        tabType: 0,
        name: "",
        categoryId: null,
        createTime: [],
      },
      selectSpu: null,
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    async getCategoryList() {
      const { data } = await ProductCategoryApi.getProductCategoryList({});
      this.originCategoryList = data;
      const categoryList = handleTree(data);
      this.categoryList = categoryList;
    },
    async getList() {
      this.loading = true;
      try {
        const {
          data: { list, total },
        } = await ProductSpuApi.getSpuPage(this.queryParams);
        this.list = list.map((item) => {
          return {
            id: item.id,
            picUrl: item.picUrl,
            name: item.name,
            categoryName: this.originCategoryList.find(
              (cate) => cate.id === item.categoryId,
            )?.name,
          };
        });
        this.total = total;
      } finally {
        this.loading = false;
      }
    },
    reset() {
      this.queryParams = {
        pageNo: 1,
        pageSize: 10,
        // 默认获取上架的商品
        tabType: 0,
        name: "",
        categoryId: null,
        createTime: [],
      };
      this.getList();
    },
    success(val) {
      this.visible = false;
      this.$emit("success", val);
    },
  },
  async mounted() {
    await this.getCategoryList();
    await this.getList();
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
