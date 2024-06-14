<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-card shadow="never" class="mb16">
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="模板名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入模板名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="计费方式" prop="chargeMode">
          <el-select
            v-model="queryParams.chargeMode"
            placeholder="计费方式"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.EXPRESS_CHARGE_MODE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
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
            plain
            @click="openForm('create')"
            v-hasPermi="['trade:delivery:express-template:create']"
            icon="el-icon-plus"
          >
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card shadow="never" class="mb16">
      <el-table v-loading="loading" :data="list">
        <el-table-column label="编号" min-width="60" prop="id" />
        <el-table-column label="模板名称" min-width="100" prop="name" />
        <el-table-column
          label="计费方式"
          prop="chargeMode"
          min-width="100"
          align="center"
        >
          <template #default="scope">
            <dict-tag
              :type="DICT_TYPE.EXPRESS_CHARGE_MODE"
              :value="scope.row.chargeMode"
            />
          </template>
        </el-table-column>
        <el-table-column label="排序" min-width="100" prop="sort" />
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
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['trade:delivery:express-template:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['trade:delivery:express-template:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 表单弹窗：添加/修改 -->
    <ExpressTemplateForm ref="formRef" @success="getList" />
  </div>
</template>
<script>
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { dateFormatter } from "@/utils/formatTime";
import * as DeliveryExpressTemplateApi from "@/api/mall/trade/delivery/expressTemplate";
import ExpressTemplateForm from "./ExpressTemplateForm.vue";

export default {
  name: "DeliveryExpressTemplate",
  components: {
    ExpressTemplateForm,
  },
  data() {
    return {
      total: 0, // 列表的总页数
      loading: true, // 列表的加载中
      list: [], // 列表的数据
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: "",
        chargeMode: undefined,
      },
    };
  },
  methods: {
    dateFormatter,
    getIntDictOptions,
    /** 查询列表 */
    async getList() {
      this.loading = true;
      try {
        const { data } =
          await DeliveryExpressTemplateApi.getDeliveryExpressTemplatePage(
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
        // 删除的二次确认
        await this.$message.delConfirm();
        // 发起删除
        await DeliveryExpressTemplateApi.deleteDeliveryExpressTemplate(id);
        this.message.success("是否要删除");
        // 刷新列表
        await this.getList();
      } catch {}
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
