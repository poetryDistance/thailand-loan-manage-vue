import store from '@/store'

// 运营管理模块 和 我的工作台模块
import request from '@/utils/request'

// api转换 -- 获取
export function getApiStat(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'report/apiStat',
    method: 'post',
    data
  })
}

// 借款日报 -- 获取
export function getDailyStat(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'report/dailyStat',
    method: 'post',
    data
  })
}

// KYC认证 -- 获取
export function getCustomerKycData(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'report/customerKycData',
    method: 'post',
    data
  })
}

// 我的工作台 -- 数据概况
export function profileData(item) {
  const params = item || {}
  if (store.getters.currentMarketId) {
    params.marketType = store.getters.currentMarketId
  }
  return request({
    url: process.env.VUE_APP_BASE_API + 'report/profileData',
    method: 'get',
    params
  })
}

/**
 * 运营日报 -- 获取
 */
export function getOperationDayReport(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'report/operationDayReport',
    method: 'post',
    data
  })
}

/**
 * 运营日报 -- 导出
 */
export function exportOperationDayReport(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'export/exportOperationDayReport',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/**
 * 逾期报表 -- 获取
 */
export function overdueDayReport(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'report/overdueDayReport',
    method: 'post',
    data
  })
}
