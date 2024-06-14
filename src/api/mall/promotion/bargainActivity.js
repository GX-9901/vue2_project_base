import request from "@/utils/request";
// 查询砍价活动列表
export const getBargainActivityPage = (params) => {
  return request({ url: "/promotion/bargain-activity/page", params });
};

// 查询砍价活动详情
export const getBargainActivity = (id) => {
  return request({ url: "/promotion/bargain-activity/get?id=" + id });
};

// 新增砍价活动
export const createBargainActivity = (data) => {
  return request({
    method: "post",
    url: "/promotion/bargain-activity/create",
    data,
  });
};

// 修改砍价活动
export const updateBargainActivity = (data) => {
  return request({
    method: "put",
    url: "/promotion/bargain-activity/update",
    data,
  });
};

// 关闭砍价活动
export const closeBargainActivity = (id) => {
  return request({
    method: "put",
    url: "/promotion/bargain-activity/close?id=" + id,
  });
};

// 删除砍价活动
export const deleteBargainActivity = (id) => {
  return request({
    method: "delete",
    url: "/promotion/bargain-activity/delete?id=" + id,
  });
};
