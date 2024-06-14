<template>
  <div class="app-container">
    <el-card shadow="never" class="mb16">
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
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
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['promotion:diy-template:create']"
          >
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card shadow="never" class="mb16">
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="预览图" align="center" prop="previewPicUrls">
          <template #default="scope">
            <el-image
              class="h-40px max-w-40px"
              v-for="(url, index) in scope.row.previewPicUrls"
              :key="index"
              :src="url"
              :preview-src-list="scope.row.previewPicUrls"
              :initial-index="index"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column label="模板名称" align="center" prop="name" />
        <el-table-column label="是否使用" align="center" prop="used">
          <template #default="scope">
            <dict-tag
              :type="DICT_TYPE.INFRA_BOOLEAN_STRING"
              :value="scope.row.used"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="使用时间"
          align="center"
          prop="usedTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="handleDecorate(scope.row.id)"
              v-hasPermi="['promotion:diy-template:update']"
            >
              装修
            </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['promotion:diy-template:update']"
            >
              编辑
            </el-button>
            <template v-if="!scope.row.used">
              <el-button
                link
                type="primary"
                @click="handleUse(scope.row)"
                v-hasPermi="['promotion:diy-template:use']"
              >
                使用
              </el-button>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['promotion:diy-template:delete']"
              >
                删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 表单弹窗：添加/修改 -->
    <DiyTemplateForm ref="formRef" @success="getList" />
  </div>
</template>

<script>
import { dateFormatter } from "@/utils/formatTime";
import * as DiyTemplateApi from "@/api/mall/promotion/diy/template";
import DiyTemplateForm from "./DiyTemplateForm.vue";
import { DICT_TYPE } from "@/utils/dict";

/** 装修模板 */
export default {
  name: "DiyTemplate",
  components: {
    DiyTemplateForm,
  },
  data() {
    return {
      loading: true,
      total: 0,
      list: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        createTime: [],
      },
    };
  },
  methods: {
    dateFormatter,
    /** 查询列表 */
    async getList() {
      this.loading = true;
      try {
        const { data } = await DiyTemplateApi.getDiyTemplatePage(
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
        await DiyTemplateApi.deleteDiyTemplate(id);
        this.$message.success("删除成功");
        // 刷新列表
        await this.getList();
      } catch {}
    },
    /** 使用模板 */
    async handleUse(row) {
      try {
        // 使用模板的二次确认
        await this.$message.confirm(`是否使用模板“${row.name}”?`);
        // 发起删除
        await DiyTemplateApi.useDiyTemplate(row.id);
        this.$message.success("使用成功");
        // 刷新列表
        await this.getList();
      } catch {}
    },
    /** 打开装修页面 */
    handleDecorate(id) {
      this.$router.push({ name: "DiyTemplateDecorate", params: { id } });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
