<template>
  <el-card shadow="never">
    <template #header>
      <CardTitle title="用户统计" />
    </template>
    <!-- 折线图 -->
    <Echart :height="300" :options="lineChartOptions" />
  </el-card>
</template>
<script>
import dayjs from "dayjs";
import * as MemberStatisticsApi from "@/api/mall/statistics/member";
import { formatDate } from "@/utils/formatTime";
import { CardTitle } from "@/components/Card";
import { Echart } from "@/components/Echart";

/** 会员用户统计卡片 */
export default {
  name: "MemberStatisticsCard",
  components: {
    CardTitle,
    Echart,
  },
  data() {
    return {
      loading: true,
      /** 折线图配置 */
      lineChartOptions: {
        dataset: {
          dimensions: ["date", "count"],
          source: [],
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 20,
          top: 80,
          containLabel: true,
        },
        legend: {
          top: 50,
        },
        series: [{ name: "注册量", type: "line", smooth: true, areaStyle: {} }],
        toolbox: {
          feature: {
            // 数据区域缩放
            dataZoom: {
              yAxisIndex: false, // Y轴不缩放
            },
            brush: {
              type: ["lineX", "clear"], // 区域缩放按钮、还原按钮
            },
            saveAsImage: { show: true, name: "会员统计" }, // 保存为图片
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisTick: {
            show: false,
          },
          axisLabel: {
            formatter: (date) => formatDate(date, "MM-DD"),
          },
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
      },
    };
  },
  methods: {
    async getMemberRegisterCountList() {
      this.loading = true;
      // 查询最近一月数据
      const beginTime = dayjs().subtract(30, "d").startOf("d");
      const endTime = dayjs().endOf("d");
      const { data: list } =
        await MemberStatisticsApi.getMemberRegisterCountList(
          beginTime,
          endTime,
        );
      // 更新 Echarts 数据
      if (
        this.lineChartOptions.dataset &&
        this.lineChartOptions.dataset["source"]
      ) {
        this.lineChartOptions.dataset["source"] = list;
      }
      this.loading = false;
    },
  },
  mounted() {
    this.getMemberRegisterCountList();
  },
};
</script>
