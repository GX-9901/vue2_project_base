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
        <el-form-item label="活动名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入活动名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="活动状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择活动状态"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['promotion:bargain-activity:create']"
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
        <el-table-column label="活动编号" prop="id" min-width="80" />
        <el-table-column label="活动名称" prop="name" min-width="140" />
        <el-table-column label="活动时间" min-width="210">
          <template #default="scope">
            {{ formatDate(scope.row.startTime, "YYYY-MM-DD") }}
            ~ {{ formatDate(scope.row.endTime, "YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column label="商品图片" prop="spuName" min-width="80">
          <template #default="scope">
            <el-image
              :src="scope.row.picUrl"
              class="h-40px w-40px"
              :preview-src-list="[scope.row.picUrl]"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column label="商品标题" prop="spuName" min-width="300" />
        <el-table-column
          label="起始价格"
          prop="bargainFirstPrice"
          min-width="100"
          :formatter="fenToYuanFormat"
        />
        <el-table-column
          label="砍价底价"
          prop="bargainMinPrice"
          min-width="100"
          :formatter="fenToYuanFormat"
        />
        <el-table-column
          label="总砍价人数"
          prop="recordUserCount"
          min-width="100"
        />
        <el-table-column
          label="成功砍价人数"
          prop="recordSuccessUserCount"
          min-width="110"
        />
        <el-table-column
          label="助力人数"
          prop="helpUserCount"
          min-width="100"
        />
        <el-table-column
          label="活动状态"
          align="center"
          prop="status"
          min-width="100"
        >
          <template #default="scope">
            <dict-tag
              :type="DICT_TYPE.COMMON_STATUS"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="库存"
          align="center"
          prop="stock"
          min-width="80"
        />
        <el-table-column
          label="总库存"
          align="center"
          prop="totalStock"
          min-width="80"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column
          label="操作"
          align="center"
          width="150px"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['promotion:bargain-activity:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleClose(scope.row.id)"
              v-if="scope.row.status === 0"
              v-hasPermi="['promotion:bargain-activity:close']"
            >
              关闭
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-else
              v-hasPermi="['promotion:bargain-activity:delete']"
            >
              删除
            </el-button>
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
    <BargainActivityForm ref="formRef" @success="getList" />
  </div>
</template>

<script>
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { dateFormatter } from "@/utils/formatTime";
import * as BargainActivityApi from "@/api/mall/promotion/bargainActivity";
import BargainActivityForm from "./BargainActivityForm.vue";
import { formatDate } from "@/utils/formatTime";
import { fenToYuanFormat } from "@/utils";

export default {
  name: "PromotionBargainActivity",
  components: {
    BargainActivityForm,
  },
  data() {
    return {
      loading: true,
      total: 0,
      list: [],
      queryParams: { pageNo: 1, pageSize: 10, name: null, status: null },
      exportLoading: false,
    };
  },
  methods: {
    getIntDictOptions,
    dateFormatter,
    fenToYuanFormat,
    formatDate,
    /** 查询列表 */
    async getList() {
      this.loading = true;
      try {
        const { data } = await BargainActivityApi.getBargainActivityPage(
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
    /** 关闭按钮操作 */
    async handleClose() {
      try {
        // 关闭的二次确认
        await this.$message.confirm("确认关闭该砍价活动吗？");
        // 发起关闭
        await BargainActivityApi.closeSeckillActivity(id);
        this.$message.success("关闭成功");
        // 刷新列表
        await this.getList();
      } catch {}
    },
    /** 删除按钮操作 */
    async handleDelete(id) {
      try {
        // 删除的二次确认
        await this.$message.delConfirm();
        // 发起删除
        await BargainActivityApi.closeBargainActivity(id);
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
