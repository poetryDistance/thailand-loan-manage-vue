import store from '@/store'

// 催收管理接口
import request from '@/utils/request'

/**
 * 催收中订单 -- 获取催收列表
 */
export function getInCollectionOrder(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'collection/getInCollectionOrder',
    method: 'post',
    data
  })
}

/**
 * 催收订单列表 -- 获取催收列表
 */
export function getCollectionInfo(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'collection/getCollectionInfo',
    method: 'post',
    data
  })
}

/**
 * 催收完成订单 -- 获取催收列表
 */
export function getCollectionFinishInfo(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'collection/getCollectionFinishInfo',
    method: 'post',
    data
  })
}

/**
 * 催收订单列表 -- 获取相同周期的组
 */
export function getSimilarPeriod(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'collection/getSimilarPeriod',
    method: 'post',
    data
  })
}

/**
 * 催收订单列表 -- 批量派单
 */
export function batchCollection(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'collection/batchCollection',
    method: 'post',
    data
  })
}

/**
 * 催收订单列表 -- 用户详情 -- 用户基本信息
 */
export function getUserDate(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'customer/customerInfo',
    method: 'post',
    data
  })
}

/**
 * 催收订单列表 -- 用户详情 -- 订单分期信息
 */
export function getBorrowPeriods(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'customer/getBorrowPeriods',
    method: 'post',
    data
  })
}

/**
 * 催收订单列表 -- 用户详情 -- 借款信息
 */
export function getUserBorrowData(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'customer/getUserBorrowData',
    method: 'post',
    data
  })
}

/**
 * 催收订单列表 -- 用户详情 -- 委案变更记录
 */
export function getCaseChange(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'customer/getCaseChange',
    method: 'post',
    data
  })
}

/**
 * 催收订单列表 -- 用户详情 -- 催记
 */
export function getRecordInfo(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'customer/getRecordInfo',
    method: 'post',
    data
  })
}

/**
 * 催收订单列表 -- 用户详情 -- 新增催记
 */
export function addPushDown(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'collection/addPushDown',
    method: 'post',
    data
  })
}

/**
 * 减免订单 -- 获取减免列表
 */
export function discountList(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'collection/discountList',
    method: 'post',
    data
  })
}

/**
 * 减免订单 -- 提交减免
 */
export function addDiscount(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'collection/addDiscount',
    method: 'post',
    data
  })
}

/**
 * 减免订单 -- 审核减免
 */
export function auditDiscount(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'collection/auditDiscount',
    method: 'post',
    data
  })
}

/**
 * 减免订单 -- 催收记录
 */
export function getCollectionRecord(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'collection/getCollectionRecord',
    method: 'post',
    data
  })
}

/**
 * 催收业绩 -- 获取
 */
export function getEmployeeData(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'collection/employeeData',
    method: 'post',
    data
  })
}

/**
 * 线下还款订单 / 还款记录 -- 获取
 */
export function getOfflineRepay(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'collection/offlineRepay',
    method: 'post',
    data
  })
}

/**
 * 线下还款订单 / 还款记录 -- 导出
 */
export function exportOfflineRepay(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'export/exportOfflineRepay',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/**
 * 用户详情 -- 黑名单
 */
export function isBlack(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'customer/isBlack',
    method: 'post',
    data
  })
}

/**
 * 催收订单列表 -- 导出
 */
export function exportCollectionInfo(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'export/exportCollectionInfo',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/**
 * 催收记录 -- 导出
 */
export function exportCollectionRecord(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'export/exportCollectionRecord',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
