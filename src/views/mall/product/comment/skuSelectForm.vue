<script>
import {getProductCategoryList} from "@/api/mall/product/category";
export default {
  name: "SkuSelectForm",
  data() {
    return {
      visible: false,
      searchParams: {
        pageNo: 1,
        pageSize: 5,
      },
      total: 0,
      list: [],
      loading: false,
      treeData: [],
    };
  },
  methods: {
    close() {
      this.visible = false;
    },
    open() {
      this.visible = true;
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    groupByParentId(data) {
      return data.reduce((p, c) => {
        if (p[c.parentId]) {
          p[c.parentId].push(c);
        } else {
          p[c.parentId] = [c];
        }
        return p;
      }, {});
    },
    handleTreeData(data) {
      const treeData = data[0];
      return treeData.map((item) => {
        item.children = data[item.id] || [];
        return item;
      });
    },
    async getGoodsList() {
      const res = await getProductCategoryList();
      const data = this.groupByParentId(res.data);
      this.treeData = this.handleTreeData(data);
    },
    },
  mounted() {
    this.getGoodsList();
  },
}
</script>

<template>
<GGDialog :visible.sync="visible" title="选择商品">
  <el-card shadow="never">
    <el-form inline >
      <el-form-item label="商品名称">
        <el-input type="text"  placeholder="请输入商品名称" size="small"/>
      </el-form-item>
      <el-form-item label="商品分类">
        <GGTreeSelect :treeData="treeData"
                      :defaultProps="{
                        children: 'children',
                        label: 'name',
                      }">

        </GGTreeSelect>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="-"
          size="small"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="loading" row-key="id" class="mb-20">
      <el-table-column label="商品编号" align="center"></el-table-column>
      <el-table-column label="商品图片" align="center">
        <template v-slot="{ row }">
          <el-image :src="row"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center"></el-table-column>
      <el-table-column label="商品分类" align="center"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchParams.pageNo"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="searchParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
      class="flex-end"
    >
    </el-pagination>
  </el-card>
</GGDialog>
</template>

<style scoped lang="scss">

</style>
