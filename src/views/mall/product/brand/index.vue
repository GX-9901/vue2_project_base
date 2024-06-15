<template>
  <div class="product-brand">
    <el-card class="box-card" shadow="never">

      <el-form inline >
        <el-form-item label="品牌名称">
          <el-input v-model="input" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              label="开启"
              value="0">
            </el-option>
            <el-option
              label="关闭"
              value="1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="block">
            <el-date-picker
              class="brand-date-picker"
              v-model="value1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
          <el-button icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="brand-toolbox">
        <el-button icon="el-icon-plus" type="primary" plain size="mini" plain>新增</el-button>
        <el-row :gutter="10">
          <el-button icon="el-icon-search" circle></el-button>
          <el-button icon="el-icon-refresh" circle></el-button>
        </el-row>
      </div>
    </el-card>
    <el-card shadow="never">
      <el-table :data="list">
        <el-table-column
          prop="id"
          label="品牌编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="品牌名称">
        </el-table-column>
        <el-table-column
          label="品牌图片">
          <template v-slot="{row}">
            <img class="brand-img" :src="row.picUrl" :alt="row.name" />
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="品牌排序">
        </el-table-column>
        <el-table-column
          prop="description"
          label="品牌描述">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template v-slot="{row}">
            <el-tag v-if="row.status === 0">成功</el-tag>
            <el-tag v-else>失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column label="操作"></el-table-column>

      </el-table>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="brand-pagination"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {getProductBrandPage} from '@/api/mall/product/brand'
export default {
  name: "ProductBrand",
  data() {
    return {
      list:[],
      total:'',
    }
  },
  methods:{
    handleSizeChange(){

    },
    async getList(){
      const {data} = await getProductBrandPage({
        pageNo: 1,
        pageSize: 5,
        name: "",
        status: "",
        createTime: []
      });
      console.log(data)
      this.list = data.list;
      this.total = data.total;
    },
  },
  mounted() {
    this.getList()
  }
};
</script>

<style>
.brand-toolbox{
  display: flex;
  justify-content: space-between;
}
.product-brand {
  padding: 20px;

}
.box-card{
  margin-bottom: 30px;
}

.brand-date-picker {
  width: 250px;
}
.el-table .cell{
  text-align : center;
}
.brand-img{
  width: 100px;
  height: 100px;
}
.brand-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

</style>
