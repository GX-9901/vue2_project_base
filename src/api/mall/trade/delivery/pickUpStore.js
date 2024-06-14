import request from "@/utils/request";
// 查询自提门店列表
export const getDeliveryPickUpStorePage = (params) => {
  return request({ url: "/trade/delivery/pick-up-store/page", params });
};

// 查询自提门店详情
export const getDeliveryPickUpStore = (id) => {
  return request({ url: "/trade/delivery/pick-up-store/get?id=" + id });
};

// 查询自提门店精简列表
export const getListAllSimple = () => {
  return request({
    url: "/trade/delivery/pick-up-store/list-all-simple",
  });
};

// 新增自提门店
export const createDeliveryPickUpStore = (data) => {
  return request({
    method: "post",
    url: "/trade/delivery/pick-up-store/create",
    data,
  });
};

// 修改自提门店
export const updateDeliveryPickUpStore = (data) => {
  return request({
    method: "put",
    url: "/trade/delivery/pick-up-store/update",
    data,
  });
};

// 删除自提门店
export const deleteDeliveryPickUpStore = (id) => {
  return request({
    method: "delete",
    url: "/trade/delivery/pick-up-store/delete?id=" + id,
  });
};
