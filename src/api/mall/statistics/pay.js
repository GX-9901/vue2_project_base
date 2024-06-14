import request from "@/utils/request";

/** 获取钱包充值金额 */
export const getWalletRechargePrice = async () => {
  return request({ url: `/statistics/pay/summary` });
};
