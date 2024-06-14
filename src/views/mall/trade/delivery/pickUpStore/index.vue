<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-card shadow="never" class="mb16">
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryParams"
        class="-mb-15px"
      >
        <el-form-item label="门店手机" prop="phone">
          <el-input
            v-model="queryParams.phone"
            class="!w-240px"
            clearable
            placeholder="请输门店手机"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="门店名称" prop="name">
          <el-input
            v-model="queryParams.name"
            class="!w-240px"
            clearable
            placeholder="请输门店名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="门店状态" prop="status">
          <el-select
            v-model="queryParams.status"
            class="!w-240px"
            clearable
            placeholder="门店状态"
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
            class="!w-240px"
            end-placeholder="结束日期"
            start-placeholder="开始日期"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" plain @click="handleQuery">
            搜索
          </el-button>
          <el-button icon="el-icon-refresh" plain @click="resetQuery">
            重置
          </el-button>
          <el-button
            v-hasPermi="['trade:delivery:pick-up-store:create']"
            plain
            type="primary"
            @click="openForm('create')"
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
        <el-table-column label="编号" min-width="80" prop="id" />
        <el-table-column label="门店 logo" min-width="100" prop="logo">
          <template #default="scope">
            <img
              v-if="scope.row.logo"
              :src="scope.row.logo"
              alt="门店 logo"
              :style="{ height: '50px' }"
            />
          </template>
        </el-table-column>
        <el-table-column label="门店名称" min-width="150" prop="name" />
        <el-table-column label="门店手机" min-width="100" prop="phone" />
        <el-table-column label="地址" min-width="100" prop="detailAddress" />
        <el-table-column label="营业时间" min-width="180">
          <template #default="scope">
            {{ scope.row.openingTime }} ~ {{ scope.row.closingTime }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="开启状态"
          min-width="100"
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
          label="创建时间"
          prop="createTime"
          width="180"
        />
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button
              v-hasPermi="['trade:delivery:pick-up-store:update']"
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPermi="['trade:delivery:pick-up-store:delete']"
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 表单弹窗：添加/修改 -->
    <DeliveryPickUpStoreForm ref="formRef" @success="getList" />
  </div>
</template>
<script>
import * as DeliveryPickUpStoreApi from "@/api/mall/trade/delivery/pickUpStore";
import DeliveryPickUpStoreForm from "./PickUpStoreForm.vue";
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { dateFormatter } from "@/utils/formatTime";

export default {
  name: "DeliveryPickUpStore",
  components: {
    DeliveryPickUpStoreForm,
  },
  data() {
    return {
      total: 0, // 列表的总页数
      loading: true, // 列表的加载中
      list: [], // 列表的数据
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        status: undefined,
        phone: undefined,
        name: undefined,
        createTime: [],
      },
    };
  },
  methods: {
    dateFormatter,
    getIntDictOptions,
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
        await DeliveryPickUpStoreApi.deleteDeliveryPickUpStore(id);
        this.$message.success("删除成功");
        // 刷新列表
        await this.getList();
      } catch {}
    },
    /** 查询列表 */
    async getList() {
      this.loading = true;
      try {
        const { data } =
          await DeliveryPickUpStoreApi.getDeliveryPickUpStorePage(
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
  mounted() {
    this.getList();
  },
};
</script>
