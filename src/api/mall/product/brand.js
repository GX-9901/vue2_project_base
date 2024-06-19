import request from '@/utils/request'
export function getProductBrandPage(params){
  return request({
    url: 'product/brand/page',
    method: 'get',
    params

  })
}
export function createProductBrand(data){
  return request({
    url: 'product/brand/create',
    method: 'post',
    data
  })
}

export function updateProductBrand(data){
  return request({
    url: 'product/brand/update/',
    method: 'put',
    data
  })
}

export function deleteProductBrand(id){
  return request({
    url: 'product/brand/delete',
    method: 'delete',
    params: {
      id
    }

  })
}
export const getBrandList = () => {};
