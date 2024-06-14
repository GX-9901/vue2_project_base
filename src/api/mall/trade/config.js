import request from "@/utils/request";

// 查询交易中心配置详情
export const getTradeConfig = () => {
  return request({ url: `/trade/config/get` });
};

// 保存交易中心配置
export const saveTradeConfig = (data) => {
  return request({ method: "put", url: `/trade/config/save`, data });
};
