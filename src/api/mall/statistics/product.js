import request from "@/utils/request";
import { DataComparisonRespVO } from "@/api/mall/statistics/common";

// 商品统计 API
export const ProductStatisticsApi = {
  // 获得商品统计分析
  getProductStatisticsAnalyse: (params) => {
    return request.get({
      url: "/statistics/product/analyse",
      params,
    });
  },
  // 获得商品状况明细
  getProductStatisticsList: (params) => {
    return request.get({
      url: "/statistics/product/list",
      params,
    });
  },
  // 导出获得商品状况明细 Excel
  exportProductStatisticsExcel: (params) => {
    return request.download({
      url: "/statistics/product/export-excel",
      params,
    });
  },
  // 获得商品排行榜分页
  getProductStatisticsRankPage: async (params) => {
    return await request.get({
      url: `/statistics/product/rank-page`,
      params,
    });
  },
};
