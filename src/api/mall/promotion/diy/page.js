import request from "@/utils/request";

// 查询装修页面列表
export const getDiyPagePage = (params) => {
  return request({ url: `/promotion/diy-page/page`, params });
};

// 查询装修页面详情
export const getDiyPage = (id) => {
  return request({ url: `/promotion/diy-page/get?id=` + id });
};

// 新增装修页面
export const createDiyPage = (data) => {
  return request({ method: "post", url: `/promotion/diy-page/create`, data });
};

// 修改装修页面
export const updateDiyPage = (data) => {
  return request({ method: "put", url: `/promotion/diy-page/update`, data });
};

// 删除装修页面
export const deleteDiyPage = (id) => {
  return request({
    method: "delete",
    url: `/promotion/diy-page/delete?id=` + id,
  });
};

// 获得装修页面属性
export const getDiyPageProperty = (id) => {
  return request({ url: `/promotion/diy-page/get-property?id=` + id });
};

// 更新装修页面属性
export const updateDiyPageProperty = (data) => {
  return request({
    method: "put",
    url: `/promotion/diy-page/update-property`,
    data,
  });
};
