<template>
  <div class="app-container">
    <el-card shadow="never" class="mb16">
      <!-- 搜索工作栏 -->
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryParams"
        class="-mb-15px"
        label-width="68px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="queryParams.name"
            class="!w-240px"
            clearable
            placeholder="请输入分类名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            class="!w-240px"
            clearable
            placeholder="请选择状态"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-240px"
            end-placeholder="结束日期"
            start-placeholder="开始日期"
            type="daterange"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery"> 搜索 </el-button>
          <el-button @click="resetQuery"> 重置 </el-button>
          <el-button
            v-hasPermi="['promotion:article-category:create']"
            plain
            type="primary"
            @click="openForm('create')"
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
        :show-overflow-tooltip="true"
        :stripe="true"
      >
        <el-table-column
          align="center"
          label="编号"
          prop="id"
          min-width="100"
        />
        <el-table-column
          align="center"
          label="分类名称"
          prop="name"
          min-width="240"
        />
        <el-table-column label="分类图图" min-width="80">
          <template #default="{ row }">
            <el-image
              :src="row.picUrl"
              class="h-30px w-30px"
              @click="imagePreview(row.picUrl)"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态"
          prop="status"
          min-width="150"
        >
          <template #default="scope">
            <dict-tag
              :type="DICT_TYPE.COMMON_STATUS"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="排序"
          prop="sort"
          min-width="150"
        />
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          label="创建时间"
          prop="createTime"
          width="180px"
        />
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button
              v-hasPermi="['promotion:article-category:update']"
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPermi="['promotion:article-category:delete']"
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNo"
        :total="total"
        @pagination="getList"
      />
    </el-card>

    <!-- 表单弹窗：添加/修改 -->
    <ArticleCategoryForm ref="formRef" @success="getList" />
  </div>
</template>

<script>
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { dateFormatter } from "@/utils/formatTime";
import * as ArticleCategoryApi from "@/api/mall/promotion/articleCategory";
import ArticleCategoryForm from "./ArticleCategoryForm.vue";
// import { createImageViewer } from "@/components/ImageViewer";

export default {
  name: "PromotionArticleCategory",
  components: {
    ArticleCategoryForm,
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
        status: null,
        createTime: [],
      },
      exportLoading: false,
    };
  },
  methods: {
    getIntDictOptions,
    dateFormatter,
    /** 分类图预览 */
    imagePreview(imgUrl) {
      // createImageViewer({
      //   urlList: [imgUrl],
      // });
    },
    /** 查询列表 */
    async getList() {
      this.loading = true;
      try {
        const { data } = await ArticleCategoryApi.getArticleCategoryPage(
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
        await ArticleCategoryApi.deleteArticleCategory(id);
        this.$message.success("删除成功");
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
