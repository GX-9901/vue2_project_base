import request from "@/utils/request";
import { formatDate } from "@/utils";

// 查询交易统计
export const getTradeStatisticsSummary = () => {
  return request.get({
    url: "/statistics/trade/summary",
  });
};

// 获得交易状况统计
export const getTradeStatisticsAnalyse = (params) => {
  return request.get({
    url: "/statistics/trade/analyse",
    params: formatDateParam(params),
  });
};

// 获得交易状况明细
export const getTradeStatisticsList = (params) => {
  return request.get({
    url: "/statistics/trade/list",
    params: formatDateParam(params),
  });
};

// 导出交易状况明细
export const exportTradeStatisticsExcel = (params) => {
  return request.download({
    url: "/statistics/trade/export-excel",
    params: formatDateParam(params),
  });
};

// 获得交易订单数量
export const getOrderCount = async () => {
  return request({ url: `/statistics/trade/order-count` });
};

// 获得交易订单数量对照
export const getOrderComparison = async () => {
  return request({
    url: `/statistics/trade/order-comparison`,
  });
};

// 获得订单量趋势统计
export const getOrderCountTrendComparison = (type, beginTime, endTime) => {
  return request({
    url: "/statistics/trade/order-count-trend",
    params: {
      type,
      beginTime: formatDate(beginTime),
      endTime: formatDate(endTime),
    },
  });
};

/** 时间参数需要格式化, 确保接口能识别 */
const formatDateParam = (params) => {
  return { times: [formatDate(params.times[0]), formatDate(params.times[1])] };
};
