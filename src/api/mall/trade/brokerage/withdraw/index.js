import request from "@/utils/request";

// 查询佣金提现列表
export const getBrokerageWithdrawPage = (params) => {
  return request({ url: `/trade/brokerage-withdraw/page`, params });
};

// 查询佣金提现详情
export const getBrokerageWithdraw = (id) => {
  return request({ url: `/trade/brokerage-withdraw/get?id=` + id });
};

// 佣金提现 - 通过申请
export const approveBrokerageWithdraw = (id) => {
  return request({
    method: "put",
    url: `/trade/brokerage-withdraw/approve?id=` + id,
  });
};

// 审核佣金提现 - 驳回申请
export const rejectBrokerageWithdraw = (data) => {
  return request({
    method: "put",
    url: `/trade/brokerage-withdraw/reject`,
    data,
  });
};
