import request from "@/utils/request";

// 查询拼团活动列表
export const getCombinationActivityPage = (params) => {
  return request({ url: "/promotion/combination-activity/page", params });
};

// 查询拼团活动详情
export const getCombinationActivity = (id) => {
  return request({ url: "/promotion/combination-activity/get?id=" + id });
};

// 新增拼团活动
export const createCombinationActivity = (data) => {
  return request({
    method: "post",
    url: "/promotion/combination-activity/create",
    data,
  });
};

// 修改拼团活动
export const updateCombinationActivity = (data) => {
  return request({
    method: "put",
    url: "/promotion/combination-activity/update",
    data,
  });
};

// 关闭拼团活动
export const closeCombinationActivity = (id) => {
  return request({
    method: "put",
    url: "/promotion/combination-activity/close?id=" + id,
  });
};

// 删除拼团活动
export const deleteCombinationActivity = (id) => {
  return request({
    method: "delete",
    url: "/promotion/combination-activity/delete?id=" + id,
  });
};
