import request from "@/utils/request";

// 查询文章管理列表
export const getArticlePage = (params) => {
  return request({ url: `/promotion/article/page`, params });
};

// 查询文章管理详情
export const getArticle = (id) => {
  return request({ url: `/promotion/article/get?id=` + id });
};

// 新增文章管理
export const createArticle = (data) => {
  return request({ method: "post", url: `/promotion/article/create`, data });
};

// 修改文章管理
export const updateArticle = (data) => {
  return request({ method: "put", url: `/promotion/article/update`, data });
};

// 删除文章管理
export const deleteArticle = (id) => {
  return request({
    method: "delete",
    url: `/promotion/article/delete?id=` + id,
  });
};
