// 市场管理接口
import request from '@/utils/request'

/**
 * 获取市场名称
 */
export function getMarketNameList(params) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'loan/getMarketNameList',
    method: 'get',
    params
  })
}

/**
 * 产品列表 -- 获取列表
 */
export function getProductList(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'product/productList',
    method: 'post',
    data
  })
}

/**
 * 产品列表 -- 添加产品
 */
export function addProduct(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'product/addProduct',
    method: 'post',
    data
  })
}

/**
 * 产品列表 -- 修改产品
 */
export function updateProduct(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'product/updateProduct',
    method: 'post',
    data
  })
}

/**
 * 产品列表 -- 删除产品
 */
export function delProduct(params) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'product/delProduct',
    method: 'get',
    params
  })
}

/**
 * 市场列表 -- 获取
 */
export function getMarketList(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'loan/getMarketList',
    method: 'post',
    data
  })
}

/**
 * 市场列表 -- 添加
 */
export function addMarket(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'loan/addMarket',
    method: 'post',
    data
  })
}

/**
 * 市场列表 -- 修改
 */
export function updateMarket(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'loan/updateMarket',
    method: 'post',
    data
  })
}
