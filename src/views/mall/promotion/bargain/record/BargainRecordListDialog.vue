<template>
  <Dialog :visible.sync="dialogVisible" title="助力列表">
    <!-- 列表 -->
    <el-card shadow="never" class="mb16">
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <el-table-column label="用户编号" prop="userId" min-width="80px" />
        <el-table-column label="用户头像" prop="avatar" min-width="80px">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column label="用户昵称" prop="nickname" min-width="100px" />
        <el-table-column
          label="砍价金额"
          prop="reducePrice"
          min-width="100px"
          :formatter="fenToYuanFormat"
        />
        <el-table-column
          label="助力时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
  </Dialog>
</template>

<script>
import { dateFormatter } from "@/utils/formatTime";
import * as BargainHelpApi from "@/api/mall/promotion/bargainHelp";
import { fenToYuanFormat } from "@/utils";

/** 助力列表 */
export default {
  name: "BargainRecordListDialog",
  data() {
    return {
      loading: true,
      total: 0,
      list: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        recordId: undefined,
      },
      dialogVisible: false,
    };
  },
  methods: {
    dateFormatter,
    fenToYuanFormat,
    open(recordId) {
      this.dialogVisible = true;
      this.queryParams.recordId = recordId;
      this.resetQuery();
    },
    async getList() {
      this.loading = true;
      try {
        const { data } = await BargainHelpApi.getBargainHelpPage(
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
  },
};
</script>
