import request from "@/utils/request";

// 查询砍价记录列表
export const getBargainHelpPage = (params) => {
  return request({ url: `/promotion/bargain-help/page`, params });
};
