<template>
  <div class="app-container">
    <el-card shadow="never" class="mb16">
      <el-form
        inline
        ref="queryFormRef"
        :model="queryParams"
        label-width="100px"
      >
        <el-form-item label="快递公司编号" prop="code">
          <el-input
            placeholder="请输入快递公司编号"
            v-model="queryParams.code"
            clearable
          />
        </el-form-item>
        <el-form-item label="快递公司名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入快递公司名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" plain @click="handleQuery">
            搜索
          </el-button>
          <el-button icon="el-icon-refresh" plain @click="resetQuery">
            重置
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            plain
            @click="openForm('create')"
            v-hasPermi="['trade:delivery:express:create']"
          >
            新增
          </el-button>
          <el-button
            type="success"
            icon="el-icon-download"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['trade:delivery:express:export']"
          >
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="list">
        <el-table-column label="公司编码" prop="code" />
        <el-table-column label="公司名称" prop="name" />
        <el-table-column label="公司 logo " prop="logo">
          <template #default="scope">
            <img
              v-if="scope.row.logo"
              :src="scope.row.logo"
              alt="公司logo"
              style="height: 40px"
            />
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column label="开启状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag
              :type="DICT_TYPE.COMMON_STATUS"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
          :formatter="dateFormatter"
        />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              type="text"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['trade:delivery:express:update']"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['trade:delivery:express:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 表单弹窗：添加/修改 -->
    <ExpressForm ref="formRef" @success="getList" />
  </div>
</template>
<script>
import * as DeliveryExpressApi from "@/api/mall/trade/delivery/express";
import { dateFormatter } from "@/utils/formatTime";
import ExpressForm from "./ExpressForm.vue";
import download from "@/utils/download";

export default {
  name: "DeliveryExpress",
  components: {
    ExpressForm,
  },
  data() {
    return {
      total: 0,
      loading: true,
      list: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        code: "",
        name: "",
      },
      exportLoading: false,
    };
  },
  methods: {
    dateFormatter,
    /** 查询列表 */
    async getList() {
      this.loading = true;
      try {
        const { data } = await DeliveryExpressApi.getDeliveryExpressPage(
          this.queryParams,
        );
        this.list = data.list;
        this.total = data.total;
      } finally {
        this.loading = false;
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs.queryFormRef.resetFields();
      this.handleQuery();
    },
    /** 添加/修改操作 */
    openForm(type, id) {
      this.$refs.formRef.open(type, id);
    },
    /** 删除按钮操作 */
    async handleDelete(id) {
      try {
        await this.$confirm("是否删除当前数据项？", {
          type: "warning",
        });
        // 发起删除
        await DeliveryExpressApi.deleteDeliveryExpress(id);
        this.$message.success("删除成功");
        // 刷新列表
        this.getList();
      } catch {}
    },
    /** 导出按钮操作 */
    async handleExport() {
      try {
        // 导出的二次确认
        await this.$confirm("是否确认导出数据项？", {
          type: "warning",
        });
        // 发起导出
        this.exportLoading = true;
        const data = await DeliveryExpressApi.exportDeliveryExpressApi(
          this.queryParams,
        );
        download.excel(data, "快递公司.xls");
      } finally {
        this.exportLoading = false;
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.mb16 :deep(.el-form-item) {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
