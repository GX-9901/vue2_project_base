import request from "@/utils/request";

// 查询拼团记录列表
export const getCombinationRecordPage = (params) => {
  return request({ url: "/promotion/combination-record/page", params });
};

// 获得拼团记录的概要信息
export const getCombinationRecordSummary = () => {
  return request({ url: "/promotion/combination-record/get-summary" });
};
