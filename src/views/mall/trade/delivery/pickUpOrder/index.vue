<template>
  <div class="app-container">
    <!-- 搜索 -->
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
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-280px"
            end-placeholder="自定义时间"
            start-placeholder="自定义时间"
            type="daterange"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="自提门店" prop="pickUpStoreId">
          <el-select
            v-model="queryParams.pickUpStoreId"
            class="!w-280px"
            clearable
            multiple
            placeholder="全部"
          >
            <el-option
              v-for="item in pickUpStoreList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="聚合搜索">
          <el-input
            v-show="true"
            v-model="queryParams[queryType.queryParam]"
            class="!w-280px"
            clearable
            placeholder="请输入"
            :type="queryType.queryParam === 'userId' ? 'number' : 'text'"
          >
            <template #prepend>
              <el-select
                v-model="queryType.queryParam"
                class="!w-110px"
                placeholder="全部"
                @change="inputChangeSelect"
              >
                <el-option
                  v-for="dict in dynamicSearchList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" plain @click="handleQuery">
            搜索
          </el-button>
          <el-button icon="el-icon-refresh" plain @click="resetQuery">
            重置
          </el-button>
          <el-button
            @click="handlePickup"
            type="success"
            plain
            v-hasPermi="['trade:order:pick-up']"
            icon="el-icon-check"
          >
            核销
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="summary">
      <el-col :sm="6" :xs="12" v-loading="loading">
        <SummaryCard
          title="订单数量"
          icon="icon-park-outline:transaction-order"
          icon-color="bg-blue-100"
          icon-bg-color="text-blue-500"
          :value="summary?.orderCount || 0"
        />
      </el-col>
      <el-col :sm="6" :xs="12" v-loading="loading">
        <SummaryCard
          title="订单金额"
          icon="streamline:money-cash-file-dollar-common-money-currency-cash-file"
          icon-color="bg-purple-100"
          icon-bg-color="text-purple-500"
          prefix="￥"
          :decimals="2"
          :value="fenToYuan(summary?.orderPayPrice || 0)"
        />
      </el-col>
      <el-col :sm="6" :xs="12" v-loading="loading">
        <SummaryCard
          title="退款单数"
          icon="heroicons:receipt-refund"
          icon-color="bg-yellow-100"
          icon-bg-color="text-yellow-500"
          :value="summary?.afterSaleCount || 0"
        />
      </el-col>
      <el-col :sm="6" :xs="12" v-loading="loading">
        <SummaryCard
          title="退款金额"
          icon="ri:refund-2-line"
          icon-color="bg-green-100"
          icon-bg-color="text-green-500"
          prefix="￥"
          :decimals="2"
          :value="fenToYuan(summary?.afterSalePrice || 0)"
        />
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-card shadow="never" class="mb16">
      <el-table v-loading="loading" :data="list">
        <el-table-column
          label="订单号"
          align="center"
          prop="no"
          min-width="180"
        />
        <el-table-column
          label="用户信息"
          align="center"
          prop="user.nickname"
          min-width="80"
        />
        <el-table-column
          label="推荐人信息"
          align="center"
          prop="brokerageUser.nickname"
          min-width="100"
        />
        <el-table-column
          label="商品信息"
          align="center"
          prop="spuName"
          min-width="300"
        >
          <template #default="{ row }">
            <div
              class="flex items-center"
              v-for="item in row.items"
              :key="item.id"
            >
              <el-image
                :src="item.picUrl"
                class="mr-10px h-30px w-30px flex-shrink-0"
                :preview-src-list="[item.picUrl]"
                preview-teleported
              />
              <span class="mr-10px">{{ item.spuName }}</span>
              <div class="flex flex-col flex-wrap gap-1">
                <el-tag
                  v-for="property in item.properties"
                  :key="property.propertyId"
                  class="mr-10px"
                >
                  {{ property.propertyName }}: {{ property.valueName }}
                </el-tag>
                <span
                  >{{ floatToFixed2(item.price) }} 元 x {{ item.count }}</span
                >
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实付金额(元)"
          align="center"
          prop="payPrice"
          min-width="110"
          :formatter="fenToYuanFormat"
        />
        <el-table-column
          label="核销员"
          align="center"
          prop="storeStaffName"
          min-width="70"
        />
        <el-table-column
          label="核销门店"
          align="center"
          prop="pickUpStoreId"
          min-width="80"
        >
          <template #default="{ row }">
            {{ pickUpStoreList.find((p) => p.id === row.pickUpStoreId)?.name }}
          </template>
        </el-table-column>
        <el-table-column
          label="支付状态"
          align="center"
          prop="payStatus"
          min-width="80"
        >
          <template #default="{ row }">
            <dict-tag
              :type="DICT_TYPE.INFRA_BOOLEAN_STRING"
              :value="row.payStatus || false"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="订单状态"
          prop="status"
          width="120"
        >
          <template #default="{ row }">
            <dict-tag
              :type="DICT_TYPE.TRADE_ORDER_STATUS"
              :value="row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="下单时间"
          align="center"
          prop="createTime"
          min-width="170"
          :formatter="dateFormatter"
        />
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNo"
        :total="total"
        @pagination="getList"
      />
    </el-card>

    <!-- 各种操作的弹窗 -->
    <OrderPickUpForm ref="pickUpForm" @success="getList" />
  </div>
</template>

<script>
import * as TradeOrderApi from "@/api/mall/trade/order";
import * as PickUpStoreApi from "@/api/mall/trade/delivery/pickUpStore";
import { DICT_TYPE } from "@/utils/dict";
import { fenToYuan, floatToFixed2, fenToYuanFormat } from "@/utils";
import SummaryCard from "@/components/SummaryCard/index.vue";
import { dateFormatter } from "@/utils/formatTime";
import { DeliveryTypeEnum } from "@/utils/constants";
import OrderPickUpForm from "@/views/mall/trade/order/form/OrderPickUpForm.vue";

// 初始表单参数
const INIT_QUERY_PARAMS = {
  // 页数
  pageNo: 1,
  // 每页显示数量
  pageSize: 10,
  // 创建时间
  createTime: undefined,
  // 配送方式
  deliveryType: DeliveryTypeEnum.PICK_UP.type,
  // 自提门店
  pickUpStoreId: undefined,
};

export default {
  name: "PickUpOrder",
  components: {
    SummaryCard,
  },
  data() {
    return {
      loading: false, // 列表的加载中
      total: 0, // 列表的总页数
      list: [], // 列表的数据
      queryParams: {
        ...INIT_QUERY_PARAMS,
      },
      queryType: {
        // 订单搜索类型
        queryParam: "no",
      },
      summary: {}, // 订单统计数据
      // 订单聚合搜索 select 类型配置（动态搜索）
      dynamicSearchList: [
        { value: "no", label: "订单号" },
        { value: "userId", label: "用户UID" },
        { value: "userNickname", label: "用户昵称" },
        { value: "userMobile", label: "用户电话" },
      ],
      pickUpStoreList: [] /** 自提门店精简列表 */,
    };
  },
  methods: {
    dateFormatter,
    fenToYuanFormat,
    fenToYuan,
    floatToFixed2,
    // 聚合搜索切换查询对象时触发
    inputChangeSelect(val) {
      this.dynamicSearchList
        .filter((item) => item.value !== val)
        ?.forEach((item) => {
          // 清除集合搜索无用属性
          if (this.queryParams.hasOwnProperty(item.value)) {
            delete this.queryParams[item.value];
          }
        });
    },
    /** 查询列表 */
    async getList() {
      this.loading = true;
      try {
        // 统计
        const result = await TradeOrderApi.getOrderSummary(this.queryParams);
        this.summary = result.data;
        // 分页
        const { data } = await TradeOrderApi.getOrderPage(this.queryParams);
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
      this.queryParams = { ...INIT_QUERY_PARAMS };
      this.handleQuery();
    },
    async getPickUpStoreList() {
      const { data } = await PickUpStoreApi.getListAllSimple();
      this.pickUpStoreList = data;
    },
    /** 显示核销表单 */
    handlePickup() {
      this.$refs.pickUpForm.open();
    },
  },
  mounted() {
    this.getList();
    this.getPickUpStoreList();
  },
};
</script>
<style lang="scss" scoped>
:deep(.order-table-col > .cell) {
  padding: 0;
}

.summary {
  .el-col {
    margin-bottom: 1rem;
  }
}
</style>
