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
        <el-form-item label="砍价状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择砍价状态"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getIntDictOptions(
                DICT_TYPE.PROMOTION_BARGAIN_RECORD_STATUS,
              )"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
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
          <el-button @click="handleQuery"> 搜索</el-button>
          <el-button @click="resetQuery"> 重置</el-button>
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['promotion:bargain-record:create']"
          >
            新增
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['promotion:bargain-record:export']"
          >
            导出
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
        <el-table-column label="编号" min-width="50" prop="id" />
        <el-table-column label="发起用户" min-width="120">
          <template #default="scope">
            <el-image
              :src="scope.row.avatar"
              class="h-20px w-20px"
              :preview-src-list="[scope.row.avatar]"
              preview-teleported
            />
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column
          label="发起时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column
          label="砍价活动"
          min-width="150"
          prop="activity.name"
        />
        <el-table-column
          label="最低价"
          min-width="100"
          prop="activity.bargainMinPrice"
          :formatter="fenToYuanFormat"
        />
        <el-table-column
          label="当前价"
          min-width="100"
          prop="bargainPrice"
          :formatter="fenToYuanFormat"
        />
        <el-table-column
          label="总砍价次数"
          min-width="100"
          prop="activity.helpMaxCount"
        />
        <el-table-column
          label="剩余砍价次数"
          min-width="100"
          prop="helpCount"
        />
        <el-table-column label="砍价状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag
              :type="DICT_TYPE.PROMOTION_BARGAIN_RECORD_STATUS"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="结束时间"
          align="center"
          prop="endTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="订单编号" align="center" prop="orderId" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="openRecordListDialog(scope.row.id)"
              v-hasPermi="['promotion:bargain-help:query']"
            >
              助力
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

    <!-- 表单弹窗 -->
    <BargainRecordListDialog ref="recordListDialogRef" />
  </div>
</template>

<script>
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { dateFormatter } from "@/utils/formatTime";
import * as BargainRecordApi from "@/api/mall/promotion/bargainRecord";
import { fenToYuanFormat } from "@/utils";
import BargainRecordListDialog from "./BargainRecordListDialog.vue";

export default {
  name: "PromotionBargainRecord",
  components: {
    BargainRecordListDialog,
  },
  data() {
    return {
      loading: true,
      total: 0,
      list: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        status: null,
        createTime: [],
      },
      exportLoading: false,
    };
  },
  methods: {
    fenToYuanFormat,
    dateFormatter,
    getIntDictOptions,
    /** 查询列表 */
    async getList() {
      this.loading = true;
      try {
        const { data } = await BargainRecordApi.getBargainRecordPage(
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
    /** 打开[助力]弹窗 */
    openRecordListDialog(id) {
      this.$refs.recordListDialogRef.open(id);
    },
    handleExport() {},
  },
  mounted() {
    this.getList();
  },
};
</script>
