import request from "@/utils/request";
export function getCommentBrandPage(params) {
  return request({
    url: "product/comment/page",
    method: "get",
    params,
  });
}
export function createCommentBrand(data) {
  return request({
    url: "product/comment/reply",
    method: "put",
    data,
  });
}
