import request from "@/utils/request";

// 查询分销用户列表
export const getBrokerageUserPage = (params) => {
  return request({ url: `/trade/brokerage-user/page`, params });
};

// 查询分销用户详情
export const getBrokerageUser = (id) => {
  return request({ url: `/trade/brokerage-user/get?id=` + id });
};

// 修改推广员
export const updateBindUser = (data) => {
  return request({
    method: "put",
    url: `/trade/brokerage-user/update-bind-user`,
    data,
  });
};

// 清除推广员
export const clearBindUser = (data) => {
  return request({
    method: "put",
    url: `/trade/brokerage-user/clear-bind-user`,
    data,
  });
};

// 修改推广资格
export const updateBrokerageEnabled = (data) => {
  return request({
    method: "put",
    url: `/trade/brokerage-user/update-brokerage-enable`,
    data,
  });
};
