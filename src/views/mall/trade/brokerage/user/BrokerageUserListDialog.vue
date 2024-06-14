<template>
  <Dialog :visible.sync="dialogVisible" title="推广人列表" width="75%">
    <el-card shadow="never" class="mb16">
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="85px"
      >
        <el-form-item label="用户类型" prop="level">
          <el-radio-group v-model="queryParams.level" @change="handleQuery">
            <el-radio-button checked>全部</el-radio-button>
            <el-radio-button label="1">一级推广人</el-radio-button>
            <el-radio-button label="2">二级推广人</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="绑定时间" prop="bindUserTime">
          <el-date-picker
            v-model="queryParams.bindUserTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery"
            ><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button
          >
          <el-button @click="resetQuery"
            ><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button
          >
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
        <el-table-column
          label="用户编号"
          align="center"
          prop="id"
          min-width="80px"
        />
        <el-table-column label="头像" align="center" prop="avatar" width="70px">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column
          label="昵称"
          align="center"
          prop="nickname"
          min-width="80px"
        />
        <el-table-column
          label="推广人数"
          align="center"
          prop="brokerageUserCount"
          min-width="80px"
        />
        <el-table-column
          label="推广订单数量"
          align="center"
          prop="brokerageOrderCount"
          min-width="110px"
        />
        <el-table-column
          label="推广资格"
          align="center"
          prop="brokerageEnabled"
          min-width="80px"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.brokerageEnabled">有</el-tag>
            <el-tag v-else type="info">无</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="绑定时间"
          align="center"
          prop="bindUserTime"
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
import * as BrokerageUserApi from "@/api/mall/trade/brokerage/user";

/** 推广人列表 */
export default {
  name: "BrokerageUserListDialog",
  data() {
    return {
      loading: true,
      total: 0,
      list: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        bindUserId: null,
        level: "",
        bindUserTime: [],
      },
      dialogVisible: false,
    };
  },
  methods: {
    dateFormatter,
    /** 打开弹窗 */
    open(bindUserId) {
      this.dialogVisible = true;
      this.queryParams.bindUserId = bindUserId;
      this.resetQuery();
    },
    /** 查询列表 */
    async getList() {
      this.loading = true;
      try {
        const { data } = await BrokerageUserApi.getBrokerageUserPage(
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
      this.$refs.queryFormRef?.resetFields();
      this.handleQuery();
    },
  },
};
</script>
