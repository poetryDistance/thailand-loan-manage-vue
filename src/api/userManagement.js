import store from '@/store'

// 用户管理接口
import request from '@/utils/request'

/**
 * 用户查询 获取用户列表
 */
export function getUserInfo(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'customer/getUserInfo',
    method: 'post',
    data
  })
}

/**
 * 黑名单列表 - 查询
 */
export function customerBlackDateInfo(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/customerBlackDateInfo',
    method: 'post',
    data
  })
}

/**
 * 黑名单列表 - 删除
 */
export function cancelCustomerBlack(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/cancelCustomerBlack',
    method: 'post',
    data
  })
}

/**
 * 黑名单列表 - 添加
 */
export function addCustomerBlack(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/addCustomerBlack',
    method: 'post',
    data
  })
}

/**
 * 白名单列表 - 查询
 */
export function customerWhitePhones(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/customerWhitePhones',
    method: 'post',
    data
  })
}

/**
 * 白名单列表 - 删除
 */
export function cancelCustomerWhitePhone(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/cancelCustomerWhitePhone',
    method: 'post',
    data
  })
}

/**
 * 白名单列表 - 添加
 */
export function addCustomerWhitePhone(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/addCustomerWhitePhone',
    method: 'post',
    data
  })
}

/**
 * 区域列表 - 获取
 */
export function getRegions(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/regions',
    method: 'post',
    data
  })
}

/**
 * 区域列表 - 设置
 */
export function regionsBlackControl(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/regionsBlackControl',
    method: 'post',
    data
  })
}
