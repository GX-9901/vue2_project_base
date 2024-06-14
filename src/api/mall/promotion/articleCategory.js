import request from "@/utils/request";

// 查询文章分类列表
export const getArticleCategoryPage = (params) => {
  return request({ url: `/promotion/article-category/page`, params });
};

// 查询文章分类精简信息列表
export const getSimpleArticleCategoryList = () => {
  return request({ url: `/promotion/article-category/list-all-simple` });
};

// 查询文章分类详情
export const getArticleCategory = (id) => {
  return request({ url: `/promotion/article-category/get?id=` + id });
};

// 新增文章分类
export const createArticleCategory = (data) => {
  return request({
    method: "post",
    url: `/promotion/article-category/create`,
    data,
  });
};

// 修改文章分类
export const updateArticleCategory = (data) => {
  return request({
    method: "put",
    url: `/promotion/article-category/update`,
    data,
  });
};

// 删除文章分类
export const deleteArticleCategory = (id) => {
  return request({
    method: "delete",
    url: `/promotion/article-category/delete?id=` + id,
  });
};
