import request from "@/utils/request";

// 查询快递公司列表
export const getDeliveryExpressPage = (params) => {
  return request({ url: "/trade/delivery/express/page", params });
};

// 查询快递公司详情
export const getDeliveryExpress = (id) => {
  return request({ url: "/trade/delivery/express/get?id=" + id });
};

// 获得快递公司精简信息列表
export const getSimpleDeliveryExpressList = () => {
  return request({ url: "/trade/delivery/express/list-all-simple" });
};

// 新增快递公司
export const createDeliveryExpress = (data) => {
  return request({
    method: "post",
    url: "/trade/delivery/express/create",
    data,
  });
};

// 修改快递公司
export const updateDeliveryExpress = (data) => {
  return request({
    method: "put",
    url: "/trade/delivery/express/update",
    data,
  });
};

// 删除快递公司
export const deleteDeliveryExpress = (id) => {
  return request({
    method: "delete",
    url: "/trade/delivery/express/delete?id=" + id,
  });
};

// 导出快递公司 Excel
export const exportDeliveryExpressApi = (params) => {
  return request({
    method: "GET",
    responseType: "blob",
    url: "/trade/delivery/express/export-excel",
    params,
  });
};
