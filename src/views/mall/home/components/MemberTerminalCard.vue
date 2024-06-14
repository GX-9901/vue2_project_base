<template>
  <el-card shadow="never" v-loading="loading">
    <template #header>
      <CardTitle title="会员终端" />
    </template>
    <Echart :height="300" :options="terminalChartOptions" />
  </el-card>
</template>
<script>
import * as MemberStatisticsApi from "@/api/mall/statistics/member";
import { DICT_TYPE, getDictDatas } from "@/utils/dict";
import { CardTitle } from "@/components/Card";
import { Echart } from "@/components/Echart";

export default {
  name: "MemberTerminalCard",
  components: {
    CardTitle,
    Echart,
  },
  data() {
    return {
      loading: true,
      /** 会员终端统计图配置 */
      terminalChartOptions: {
        tooltip: {
          trigger: "item",
          confine: true,
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "right",
        },
        roseType: "area",
        series: [
          {
            name: "会员终端",
            type: "pie",
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
    };
  },
  methods: {
    /** 按照终端，查询会员统计列表 */
    async getMemberTerminalStatisticsList() {
      this.loading = true;
      const { data: list } =
        await MemberStatisticsApi.getMemberTerminalStatisticsList();
      const dictDataList = getDictDatas(DICT_TYPE.TERMINAL);
      this.terminalChartOptions.series[0].data = dictDataList.map(
        (dictData) => {
          const userCount = list.find(
            (item) => item.terminal == dictData.value,
          )?.userCount;
          return {
            name: dictData.label,
            value: userCount || 0,
          };
        },
      );
      this.loading = false;
    },
  },
  mounted() {
    this.getMemberTerminalStatisticsList();
  },
};
</script>
