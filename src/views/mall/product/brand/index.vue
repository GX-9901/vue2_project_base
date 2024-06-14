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
        <el-button icon="el-icon-plus" type="primary" plain>新增</el-button>
        <el-row :gutter="10">
          <el-button icon="el-icon-search" circle></el-button>
          <el-button icon="el-icon-refresh" circle></el-button>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ProductBrand",
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

//.brand-date-picker {
//  width: 250px;
//}
</style>
