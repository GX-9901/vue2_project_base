<template>
  <div class="app-container">
    <el-card shadow="never" class="mb16">
      <!-- 搜索工作栏 -->
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryParams"
        class="-mb-15px"
        label-width="80px"
      >
        <el-form-item label="文章分类" prop="categoryId">
          <el-select
            v-model="queryParams.categoryId"
            class="!w-240px"
            placeholder="全部"
            @keyup.enter="handleQuery"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="queryParams.title"
            class="!w-240px"
            clearable
            placeholder="请输入文章标题"
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
            v-hasPermi="['promotion:article:create']"
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
          label="封面"
          min-width="80"
          prop="picUrl"
        >
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
          label="标题"
          min-width="180"
          prop="title"
        />
        <el-table-column
          align="center"
          label="分类"
          min-width="180"
          prop="categoryId"
        >
          <template #default="scope">
            {{
              categoryList.find((item) => item.id === scope.row.categoryId)
                ?.name
            }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="浏览量"
          min-width="180"
          prop="browseCount"
        />
        <el-table-column
          align="center"
          label="作者"
          min-width="180"
          prop="author"
        />
        <el-table-column
          align="center"
          label="文章简介"
          min-width="250"
          prop="introduction"
        />
        <el-table-column
          align="center"
          label="排序"
          min-width="60"
          prop="sort"
        />
        <el-table-column
          align="center"
          label="状态"
          min-width="60"
          prop="status"
        >
          <template #default="scope">
            <dict-tag
              :type="DICT_TYPE.COMMON_STATUS"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          label="发布时间"
          prop="createTime"
          width="180px"
        />
        <el-table-column align="center" fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button
              v-hasPermi="['promotion:article:update']"
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPermi="['promotion:article:delete']"
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
    <ArticleForm ref="formRef" @success="getList" />
  </div>
</template>

<script>
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { dateFormatter } from "@/utils/formatTime";
import * as ArticleApi from "@/api/mall/promotion/article";
import ArticleForm from "./ArticleForm.vue";
import * as ArticleCategoryApi from "@/api/mall/promotion/articleCategory";
import * as ProductSpuApi from "@/api/mall/product/spu";
// import { createImageViewer } from "@/components/ImageViewer";

export default {
  name: "PromotionArticle",
  components: {
    ArticleForm,
  },
  data() {
    return {
      loading: true,
      total: 0,
      list: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        categoryId: undefined,
        title: null,
        status: undefined,
        spuId: undefined,
        createTime: [],
      },
      categoryList: [],
      spuList: [],
    };
  },
  methods: {
    getIntDictOptions,
    dateFormatter,
    /** 文章封面预览 */
    imagePreview(imgUrl) {
      // createImageViewer({
      //   urlList: [imgUrl],
      // });
    },
    /** 查询列表 */
    async getList() {
      this.loading = true;
      try {
        const { data } = await ArticleApi.getArticlePage(this.queryParams);
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
        await ArticleApi.deleteArticle(id);
        this.$message.success("删除成功");
        // 刷新列表
        await this.getList();
      } catch {}
    },
  },
  async mounted() {
    await this.getList();
    // 加载分类、商品列表
    const categoryListRes =
      await ArticleCategoryApi.getSimpleArticleCategoryList();
    this.categoryList = categoryListRes.data;
    // const spuListRes = await ProductSpuApi.getSpuSimpleList(); // 接口问题
    // this.spuList = spuListRes.data;
  },
};
</script>
