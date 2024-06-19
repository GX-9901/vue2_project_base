<template>
  <div class="product-brand">
    <el-card class="box-card" shadow="never">

      <el-form inline v-show="isShowSearchForm">
        <el-form-item label="品牌名称">
          <el-input v-model="inputName" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="selectStatus" placeholder="请选择">
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
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              v-model="selectDate"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFormSearch">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="handleFormReset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="brand-toolbox">
        <el-button icon="el-icon-plus" type="primary"  size="mini" @click="openUpdate" plain>新增</el-button>
        <el-row :gutter="10">
          <el-tooltip  effect="dark"
                       :content="`${isShowSearchForm ? '隐藏' : '显示'}搜索`"
                       placement="top">
            <el-button icon="el-icon-search" circle @click="isShowSearchForm = !isShowSearchForm"></el-button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="刷新" placement="top">
            <el-button icon="el-icon-refresh" circle @click="handleRefesh"></el-button>
          </el-tooltip>
        </el-row>
      </div>
    </el-card>
    <el-card shadow="never" >
      <el-table :data="list" v-loading="loading" row-key="id">
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
            <el-tag v-if="row.status === 0">开启</el-tag>
            <el-tag v-else type="info">关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="handleformatDate">

        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button type="text" size="mini" icon="el-icon-edit" @click="showUpdateForm(row)">编辑</el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteForm(row)">删除</el-button>
          </template>
        </el-table-column>

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
    <UpdateForm ref="updateFormRef" @success="getList"></UpdateForm>
  </div>
</template>

<script>
import { getProductBrandPage,deleteProductBrand } from '@/api/mall/product/brand'
import {formatDate} from "@/utils";
import UpdateForm from "@/views/mall/product/brand/updateForm.vue";
export default {
  name: "ProductBrand",
  components:{
    UpdateForm
  },
  data() {
    return {
      list:[],
      total:0,
      searchParams:{
        pageNo: 1,
        pageSize: 5,
        name: "",
        status: "",
        createTime: []
      },
      loading:false,
      inputName:'',
      selectStatus:'',
      selectDate : [],
      isShowSearchForm: true,
    }
  },
  methods:{
    deleteForm(row){
      this.$confirm('是否删除该品牌','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteProductBrand(row.id);
        this.$message.success('删除成功');
        this.getList();
      })
    },
    showUpdateForm(row){
      this.$refs.updateFormRef.open(row);
      console.log(row);
      this.$refs.updateFormRef.updateFormData= {...row};
    },
    openUpdate(){
      this.$refs.updateFormRef.open();
    },
    handleRefesh(){
      this.getList();
    },
    handleFormSearch(){
      this.searchParams.name = this.inputName;
      this.searchParams.status = this.selectStatus;
      this.searchParams.createTime = this.selectDate;
      this.getList();
    },
    handleFormReset(){
      this.inputName = '';
      this.selectStatus = '';
      this.searchParams = {
        pageNo: 1,
        pageSize: 5,
        name: "",
        status: "",
        createTime: []
      };
      this.getList();
    },
    handleformatDate(row){
      return formatDate(row.createTime);
    },
    handleSizeChange(pageSize){
      this.searchParams.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(pageNo){
      this.searchParams.pageNo = pageNo
      this.getList()
    },
    async getList(){
      this.loading = true;
      const {data} = await getProductBrandPage(this.searchParams);
      console.log(data)
      this.list = data.list;
      this.total = data.total;
      this.loading = false;
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
