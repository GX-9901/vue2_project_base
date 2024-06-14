import request from "@/utils/request";

// 查询快递运费模板列表
export const getDeliveryExpressTemplatePage = (params) => {
  return request({
    url: "/trade/delivery/express-template/page",
    params,
  });
};

// 查询快递运费模板详情
export const getDeliveryExpressTemplate = (id) => {
  return request({
    url: "/trade/delivery/express-template/get?id=" + id,
  });
};

// 查询快递运费模板详情
export const getSimpleTemplateList = () => {
  return request.get({
    url: "/trade/delivery/express-template/list-all-simple",
  });
};

// 新增快递运费模板
export const createDeliveryExpressTemplate = (data) => {
  return request({
    method: "post",
    url: "/trade/delivery/express-template/create",
    data,
  });
};

// 修改快递运费模板
export const updateDeliveryExpressTemplate = (data) => {
  return request({
    method: "put",
    url: "/trade/delivery/express-template/update",
    data,
  });
};

// 删除快递运费模板
export const deleteDeliveryExpressTemplate = (id) => {
  return request({
    method: "delete",
    url: "/trade/delivery/express-template/delete?id=" + id,
  });
};
