<template>
  <div class="app-container">
    <!-- 统计信息展示 -->
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card shadow="never" class="mb16">
          <div class="flex items-center">
            <div
              class="h-[50px] w-[50px] flex items-center justify-center"
              style="
                color: rgb(24 144 255);
                background-color: rgb(24 144 255 / 10%);
              "
            ></div>
            <div class="ml-[20px]">
              <div class="mb-8px text-14px text-gray-400">参与人数(个)</div>
              <CountTo
                :duration="2600"
                :end-val="recordSummary.userCount"
                :start-val="0"
                class="text-20px"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="mb16">
          <div class="flex items-center">
            <div
              class="h-[50px] w-[50px] flex items-center justify-center"
              style="
                color: rgb(162 119 255);
                background-color: rgb(162 119 255 / 10%);
              "
            ></div>
            <div class="ml-[20px]">
              <div class="mb-8px text-14px text-gray-400">成团数量(个)</div>
              <CountTo
                :duration="2600"
                :end-val="recordSummary.successCount"
                :start-val="0"
                class="text-20px"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="mb16">
          <div class="flex items-center">
            <div
              class="h-[50px] w-[50px] flex items-center justify-center"
              style="
                color: rgb(162 119 255);
                background-color: rgb(162 119 255 / 10%);
              "
            ></div>
            <div class="ml-[20px]">
              <div class="mb-8px text-14px text-gray-400">虚拟成团(个)</div>
              <CountTo
                :duration="2600"
                :end-val="recordSummary.virtualGroupCount"
                :start-val="0"
                class="text-20px"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索工作栏 -->
    <el-card shadow="never" class="mb16">
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryParams"
        class="-mb-15px"
        label-width="68px"
      >
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            :shortcuts="defaultShortcuts"
            class="!w-240px"
            end-placeholder="结束日期"
            start-placeholder="开始日期"
            type="daterange"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="拼团状态" prop="status">
          <el-select
            v-model="queryParams.status"
            class="!w-240px"
            clearable
            placeholder="全部"
          >
            <el-option
              v-for="(dict, index) in getIntDictOptions(
                DICT_TYPE.PROMOTION_COMBINATION_RECORD_STATUS,
              )"
              :key="index"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery"> 搜索 </el-button>
          <el-button @click="resetQuery"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 分页列表数据展示 -->
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
            {{
              row.headId
                ? list.find((item) => item.id === row.headId)?.nickname
                : row.nickname
            }}
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          label="开团时间"
          prop="startTime"
          width="180"
        />
        <el-table-column
          align="center"
          label="拼团商品"
          prop="type"
          show-overflow-tooltip
          min-width="300"
        >
          <template #defaul="{ row }">
            <el-image
              :src="row.picUrl"
              class="mr-5px h-30px w-30px align-middle"
              @click="imagePreview(row.picUrl)"
            />
            <span class="align-middle">{{ row.spuName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="几人团"
          prop="userSize"
          min-width="100"
        />
        <el-table-column
          align="center"
          label="参与人数"
          prop="userCount"
          min-width="100"
        />
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
        <el-table-column align="center" fixed="right" label="操作">
          <template #default="scope">
            <el-button
              v-hasPermi="['promotion:combination-record:query']"
              link
              type="primary"
              @click="openRecordListDialog(scope.row)"
            >
              查看拼团
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

    <!-- 表单弹窗 -->
    <CombinationRecordListDialog ref="combinationRecordListRef" />
  </div>
</template>
<script>
import CombinationRecordListDialog from "./CombinationRecordListDialog.vue";
import { CountTo } from "@/components/CountTo";
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { dateFormatter, defaultShortcuts } from "@/utils/formatTime";
// import { createImageViewer } from "@/components/ImageViewer";
import * as CombinationRecordApi from "@/api/mall/promotion/combinationRecord";

export default {
  name: "PromotionCombinationRecord",
  components: {
    CombinationRecordListDialog,
    CountTo,
  },
  data() {
    return {
      queryParams: {
        status: undefined, // 拼团状态
        createTime: undefined, // 创建时间
        pageSize: 10,
        pageNo: 1,
      },
      loading: true,
      total: 0,
      list: [],
      // 拼团统计数据
      recordSummary: {
        successCount: 0,
        userCount: 0,
        virtualGroupCount: 0,
      },
      defaultShortcuts,
    };
  },
  methods: {
    getIntDictOptions,
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
    /** 获得拼团记录统计信息 */
    async getSummary() {
      const { data } = await CombinationRecordApi.getCombinationRecordSummary();
      this.recordSummary = data;
    },
    /** 查看拼团详情 */
    openRecordListDialog(row) {
      this.$refs.combinationRecordListRef?.open(row.headId || row.id); // 多表达式的原因，团长的 headId 为空，就是自身的情况
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
    /** 商品图预览 */
    imagePreview(imgUrl) {
      // createImageViewer({
      //   urlList: [imgUrl],
      // });
    },
  },
  async mounted() {
    await this.getSummary();
    await this.getList();
  },
};
</script>
