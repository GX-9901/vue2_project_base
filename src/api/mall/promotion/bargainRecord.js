import request from "@/utils/request";

// 查询砍价记录列表
export const getBargainRecordPage = (params) => {
  return request({ url: `/promotion/bargain-record/page`, params });
};
