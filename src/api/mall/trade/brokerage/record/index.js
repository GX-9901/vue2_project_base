import request from "@/utils/request";

// 查询佣金记录列表
export const getBrokerageRecordPage = (params) => {
  return request({ url: `/trade/brokerage-record/page`, params });
};

// 查询佣金记录详情
export const getBrokerageRecord = (id) => {
  return request({ url: `/trade/brokerage-record/get?id=` + id });
};
