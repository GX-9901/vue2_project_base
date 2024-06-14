import request from "@/utils/request";
import { formatDate } from "@/utils";

// 查询会员统计
export const getMemberSummary = () => {
  return request({
    url: "/statistics/member/summary",
  });
};

// 查询会员分析数据
export const getMemberAnalyse = (params) => {
  return request({
    url: "/statistics/member/analyse",
    params: {
      times: [formatDate(params.times[0]), formatDate(params.times[1])],
    },
  });
};

// 按照省份，查询会员统计列表
export const getMemberAreaStatisticsList = () => {
  return request({
    url: "/statistics/member/area-statistics-list",
  });
};

// 按照性别，查询会员统计列表
export const getMemberSexStatisticsList = () => {
  return request({
    url: "/statistics/member/sex-statistics-list",
  });
};

// 按照终端，查询会员统计列表
export const getMemberTerminalStatisticsList = () => {
  return request({
    url: "/statistics/member/terminal-statistics-list",
  });
};

// 获得用户数量量对照
export const getUserCountComparison = () => {
  return request({
    url: "/statistics/member/user-count-comparison",
  });
};

// 获得会员注册数量列表
export const getMemberRegisterCountList = (beginTime, endTime) => {
  return request({
    url: "/statistics/member/register-count-list",
    params: { times: [formatDate(beginTime), formatDate(endTime)] },
  });
};
