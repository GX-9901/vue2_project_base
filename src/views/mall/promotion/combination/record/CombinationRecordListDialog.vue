<template>
  <Dialog :visible.sync="dialogVisible" title="拼团列表" width="950">
    <!-- 列表 -->
    <el-card shadow="never" class="mb16">
      <el-table v-loading="loading" :data="list">
        <el-table-column align="center" label="编号" prop="id" min-width="50" />
        <el-table-column
          align="center"
          label="头像"
          prop="avatar"
          min-width="80"
        >
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="昵称"
          prop="nickname"
          min-width="100"
        />
        <el-table-column
          align="center"
          label="开团团长"
          prop="headId"
          min-width="100"
        >
          <template #default="{ row }">
            <el-tag> {{ row.headId === 0 ? "团长" : "团员" }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          label="参团时间"
          prop="createTime"
          width="180"
        />
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          label="结束时间"
          prop="endTime"
          width="180"
        />
        <el-table-column
          align="center"
          label="拼团状态"
          prop="status"
          min-width="150"
        >
          <template #default="scope">
            <dict-tag
              :type="DICT_TYPE.PROMOTION_COMBINATION_RECORD_STATUS"
              :value="scope.row.status"
            />
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
  </Dialog>
</template>

<script>
import { dateFormatter } from "@/utils/formatTime";
import * as CombinationRecordApi from "@/api/mall/promotion/combinationRecord";
import { DICT_TYPE } from "@/utils/dict";

/** 助力列表 */
export default {
  name: "CombinationRecordListDialog",
  data() {
    return {
      loading: true,
      total: 0,
      list: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        headId: undefined,
      },
      dialogVisible: false,
    };
  },
  methods: {
    dateFormatter,
    /** 查询列表 */
    async getList() {
      this.loading = true;
      try {
        const { data } = await CombinationRecordApi.getCombinationRecordPage(
          this.queryParams,
        );
        this.list = data.list;
        this.total = data.total;
      } finally {
        this.loading = false;
      }
    },
    /** 打开弹窗 */
    open(headId) {
      this.dialogVisible = true;
      this.queryParams.headId = headId;
      this.getList();
    },
  },
};
</script>
