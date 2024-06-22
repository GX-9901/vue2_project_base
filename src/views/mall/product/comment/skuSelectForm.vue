<script>
import {getProductCategoryList} from "@/api/mall/product/category";
import {getSpuPage} from "@/api/mall/product/spu";
export default {
  name: "SkuSelectForm",
  data() {
    return {
      visible: false,
      searchParams: {
        pageNo: 1,
        pageSize: 5,
        name: "",
        tabType: 0,
        categoryId: "",
        createTime: [],
      },
      total: 0,
      list: [],
      loading: false,
      treeData: [],
      groupList: [],
      goodsgrouplist:{},
      selectPicUrl: "",
    };
  },
  methods: {
    close() {
      this.visible = false;
    },
    open() {
      this.visible = true;
    },
    handleSizeChange(pageSize) {
      this.searchParams.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(pageNo) {
      this.searchParams.pageNo = pageNo;
      this.getList();
    },
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
      this.groupList = res.data;
      const data = this.groupByParentId(res.data);
      this.treeData = this.handleTreeData(data);
    },
    async getList(){
      this.loading = true;
      await getSpuPage({
        ...this.searchParams,
        categoryId: this.goodsgrouplist,
      }).then((res) => {
        // console.log(res);
        this.list = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleGroupFormatter(row){
      return this.groupList.find((item) => item.id === row.categoryId).name;
    },
    search(){
      this.searchParams.pageNo = 1;
      this.getList();
    },
    reset(){
      this.searchParams = {
        pageNo: 1,
        pageSize: 5,
        name: "",
        tabType: 0,
        categoryId: "",
        createTime: [],
      };
      this.getList();
    },
    handleRadio(val){
      this.$emit('success', val);
      this.close()
    }
  },
  mounted() {
    this.getGoodsList();
    this.getList()
  },
}
</script>

<template>
<GGDialog :visible.sync="visible" title="选择商品">
  <el-card shadow="never">
    <el-form inline >
      <el-form-item label="商品名称">
        <el-input type="text"
                  placeholder="请输入商品名称"
                  size="small"
                  v-model="this.searchParams.name"/>
      </el-form-item>
      <el-form-item label="商品分类">
        <GGTreeSelect :treeData="treeData"
                      :defaultProps="{
                        children: 'children',
                        label: 'name',
                      }"
                      v-model="goodsgrouplist"
        >

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
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="loading" row-key="id" class="mb-20">
      <el-table-column
        label="#"
      >
        <template v-slot="{ row }">
          <el-radio
            v-model="selectPicUrl"
            @input="handleRadio"
            :label="row.picUrl"
          >
            <div></div>
          </el-radio>
        </template>
      </el-table-column>

      <el-table-column
        label="商品编号"
        align="center"
        prop="id"
      ></el-table-column>
      <el-table-column label="商品图片" align="center">
        <template v-slot="{ row }">
          <el-image :src="row.picUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称"
        align="center"
        prop="name"
      ></el-table-column>
      <el-table-column
        label="商品分类"
        align="center"
        :formatter="handleGroupFormatter"
      ></el-table-column>
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
.el-image{
  width: 50px;
  height: 50px;
}
</style>
