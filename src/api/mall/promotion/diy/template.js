import request from "@/utils/request";

// 查询装修模板列表
export const getDiyTemplatePage = (params) => {
  return request({ url: `/promotion/diy-template/page`, params });
};

// 查询装修模板详情
export const getDiyTemplate = (id) => {
  return request({ url: `/promotion/diy-template/get?id=` + id });
};

// 新增装修模板
export const createDiyTemplate = (data) => {
  return request({
    method: "post",
    url: `/promotion/diy-template/create`,
    data,
  });
};

// 修改装修模板
export const updateDiyTemplate = (data) => {
  return request({
    method: "put",
    url: `/promotion/diy-template/update`,
    data,
  });
};

// 删除装修模板
export const deleteDiyTemplate = (id) => {
  return request({
    method: "delete",
    url: `/promotion/diy-template/delete?id=` + id,
  });
};

// 使用装修模板
export const useDiyTemplate = (id) => {
  return request({
    method: "put",
    url: `/promotion/diy-template/use?id=` + id,
  });
};

// 获得装修模板属性
export const getDiyTemplateProperty = (id) => {
  return request({
    url: `/promotion/diy-template/get-property?id=` + id,
  });
};

// 更新装修模板属性
export const updateDiyTemplateProperty = (data) => {
  return request({
    method: "put",
    url: `/promotion/diy-template/update-property`,
    data,
  });
};
