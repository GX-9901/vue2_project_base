<template>
  <div class="app-container">
    <div class="flex flex-col">
      <!-- 数据对照 -->
      <el-row :gutter="16">
        <el-col :md="6" :sm="12" :xs="24" :loading="loading">
          <ComparisonCard
            tag="今日"
            title="销售额"
            prefix="￥"
            ::decimals="2"
            :value="0"
            :reference="0"
          />
        </el-col>
        <el-col :md="6" :sm="12" :xs="24" :loading="loading">
          <ComparisonCard
            tag="今日"
            title="用户访问量"
            :value="userComparison?.value?.visitUserCount || 0"
            :reference="userComparison?.reference?.visitUserCount || 0"
          />
        </el-col>
        <el-col :md="6" :sm="12" :xs="24" :loading="loading">
          <ComparisonCard tag="今日" title="订单量" :value="0" :reference="0" />
        </el-col>
        <el-col :md="6" :sm="12" :xs="24" :loading="loading">
          <ComparisonCard
            tag="今日"
            title="新增用户"
            :value="userComparison?.value?.registerUserCount || 0"
            :reference="userComparison?.reference?.registerUserCount || 0"
          />
        </el-col>
      </el-row>
      <el-row :gutter="16" class="row">
        <el-col :md="12">
          <!-- 快捷入口 -->
          <ShortcutCard />
        </el-col>
        <el-col :md="12">
          <!-- 运营数据 -->
          <OperationDataCard />
        </el-col>
      </el-row>
      <el-row :gutter="16" class="row">
        <el-col :md="18" :sm="24">
          <!-- 会员概览 -->
          <MemberFunnelCard />
        </el-col>
        <el-col :md="6" :sm="24">
          <!-- 会员终端 -->
          <MemberTerminalCard />
        </el-col>
      </el-row>
      <!-- 交易量趋势 -->
      <TradeTrendCard class="row" />
      <!-- 会员统计 -->
      <MemberStatisticsCard class="row" />
    </div>
  </div>
</template>

<script>
import ComparisonCard from "./components/ComparisonCard.vue";
import OperationDataCard from "./components/OperationDataCard.vue";
import ShortcutCard from "./components/ShortcutCard.vue";
import MemberFunnelCard from "./components/MemberFunnelCard.vue";
import MemberTerminalCard from "./components/MemberTerminalCard.vue";
import TradeTrendCard from "./components/TradeTrendCard.vue";
import MemberStatisticsCard from "./components/MemberStatisticsCard.vue";
import * as TradeStatisticsApi from "@/api/mall/statistics/trade";
import * as MemberStatisticsApi from "@/api/mall/statistics/member";

export default {
  name: "MallHome",
  components: {
    ComparisonCard,
    OperationDataCard,
    ShortcutCard,
    MemberFunnelCard,
    MemberTerminalCard,
    TradeTrendCard,
    MemberStatisticsCard
  },
  data() {
    return {
      orderComparison: {
        value: {},
        reference: {},
      },
      userComparison: {
        value: {},
        reference: {},
      },
      loading: true,
    };
  },
  methods: {
    /** 查询交易对照卡片数据 */
    async getOrderComparisonApi() {
      const res = await TradeStatisticsApi.getOrderComparison();
      this.orderComparison = res.data;
    },

    /** 查询会员用户数量对照卡片数据 */
    async getUserCountComparisonApi() {
      const res = await MemberStatisticsApi.getUserCountComparison();
      this.userComparison = res.data;
    },
  },
  async mounted() {
    this.loading = true;
    await Promise.all([
      this.getOrderComparisonApi(),
      this.getUserCountComparisonApi(),
    ]);
    this.loading = false;
  },
};
</script>

<style scoped lang="scss">
.row {
  margin-top: 16px;
}
</style>
