<template>
  <el-card shadow="never">
    <template #header>
      <div class="memberFunnel-header">
        <CardTitle title="会员概览" />
        <!-- 查询条件 -->
        <ShortcutDateRangePicker @change="handleTimeRangeChange" />
      </div>
    </template>
    <div class="memberFunnel-content" v-loading="loading">
      <div class="memberFunnel-item">
        <div class="memberFunnel-item-container">
          <span class="memberFunnel-item-text bold">
            注册用户数量：{{
              analyseData?.comparison?.value?.registerUserCount || 0
            }}
          </span>
          <span class="memberFunnel-item-text">
            环比增长率：{{
              calculateRelativeRate(
                analyseData?.comparison?.value?.registerUserCount,
                analyseData?.comparison?.reference?.registerUserCount,
              )
            }}%
          </span>
        </div>
        <div class="memberFunnel-item-chart">
          <span class="bold">
            {{ analyseData?.visitUserCount || 0 }}
          </span>
          <span>访客</span>
        </div>
      </div>
      <div class="memberFunnel-item">
        <div class="memberFunnel-item-container">
          <span class="memberFunnel-item-text bold">
            活跃用户数量：{{
              analyseData?.comparison?.value?.visitUserCount || 0
            }}
          </span>
          <span class="memberFunnel-item-text">
            环比增长率：{{
              calculateRelativeRate(
                analyseData?.comparison?.value?.visitUserCount,
                analyseData?.comparison?.reference?.visitUserCount,
              )
            }}%
          </span>
        </div>
        <div class="memberFunnel-item-chart">
          <span class="bold">{{ analyseData?.orderUserCount || 0 }}</span>
          <span>下单</span>
        </div>
      </div>
      <div class="memberFunnel-item">
        <div class="memberFunnel-item-container">
          <span class="memberFunnel-item-text bold">
            充值用户数量：{{
              analyseData?.comparison?.value?.rechargeUserCount || 0
            }}
          </span>
          <span class="memberFunnel-item-text">
            环比增长率：{{
              calculateRelativeRate(
                analyseData?.comparison?.value?.rechargeUserCount,
                analyseData?.comparison?.reference?.rechargeUserCount,
              )
            }}%
          </span>
        </div>
        <div class="memberFunnel-item-chart">
          <span class="bold">{{ analyseData?.payUserCount || 0 }}</span>
          <span>成交用户</span>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script>
import * as MemberStatisticsApi from "@/api/mall/statistics/member";
import { calculateRelativeRate, fenToYuan } from "@/utils";
import { CardTitle } from "@/components/Card";
import { Echart } from "@/components/Echart";
import ShortcutDateRangePicker from "@/components/ShortcutDateRangePicker";

export default {
  name: "MemberFunnelCard",
  components: {
    CardTitle,
    Echart,
    ShortcutDateRangePicker,
  },
  data() {
    return {
      loading: false,
      // 会员分析数据
      analyseData: {},
    };
  },
  methods: {
    /** 查询会员概览数据列表 */
    async handleTimeRangeChange(times) {
      this.loading = true;
      // 查询数据
      const res = await MemberStatisticsApi.getMemberAnalyse({ times });
      this.analyseData = res.data;
      this.loading = false;
    },
    calculateRelativeRate,
    fenToYuan,
  },
};
</script>
<style lang="scss" scoped>
.trapezoid1 {
  transform: perspective(5em) rotateX(-11deg);
}

.trapezoid2 {
  transform: perspective(7em) rotateX(-20deg);
}

.trapezoid3 {
  transform: perspective(3em) rotateX(-13deg);
}

.memberFunnel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 18px;
}

.memberFunnel-content {
  min-width: 225px;
  padding: 6px 0;
}

.memberFunnel-item {
  height: 96px;
  display: flex;
  &:nth-child(1) {
    .memberFunnel-item-container {
      background-color: rgb(239, 246, 255);
    }
    .memberFunnel-item-chart {
      transform: perspective(5em) rotateX(-10deg);
      background-color: rgb(59, 130, 246);
      width: 308px;
      margin-left: -154px;
      height: 96px;
      margin-top: 8px;
    }
  }
  &:nth-child(2) {
    .memberFunnel-item-container {
      background-color: rgb(236, 254, 255);
    }
    .memberFunnel-item-chart {
      transform: perspective(7em) rotateX(-18deg);
      background-color: rgb(6, 182, 212);
      width: 224px;
      margin-left: -112px;
      height: 98px;
      margin-top: 9px;
    }
  }
  &:nth-child(3) {
    .memberFunnel-item-container {
      background-color: rgb(248, 250, 252);
    }
    .memberFunnel-item-chart {
      transform: perspective(4em) rotateX(-15deg);
      background-color: rgb(100, 116, 139);
      width: 144px;
      margin-left: -72px;
      margin-top: 14px;
      height: 92px;
    }
  }
}

.memberFunnel-item-chart {
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    font-size: 14px;
  }
  .bold {
    font-size: 20px;
  }
}

.memberFunnel-item-container {
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 60px;
  box-sizing: border-box;
}

.memberFunnel-item-text {
  font-size: 14px;
  margin-top: 10px;
}

.bold {
  font-weight: 700;
  font-size: 16px;
}
</style>
