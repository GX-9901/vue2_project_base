import request from '@/utils/request'
export function getProductBrandPage(params){
  return request({
    url: 'product/brand/page',
    method: 'get',
    params

  })
}

export const getBrandList = () => {};
