import request from "@/utils/request";
export function getCommentBrandPage(params) {
  return request({
    url: "product/comment/page",
    method: "get",
    params,
  });
}
