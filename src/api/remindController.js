import store from '@/store'

// 预提醒管理接口
import request from '@/utils/request'

/**
 * 预提醒订单 -- 获取
 */
export function remindOrderInfo(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'remind/inRemindOrder',
    method: 'post',
    data
  })
}

/**
 * 预提醒订单 -- 导出
 */
export function exportRemindOrderInfo(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'export/exportRemindOrderInfo',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/**
 * 预提醒转派记录 -- 批量转派
 */
export function batchRemindCollection(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'remind/batchRemindCollection',
    method: 'post',
    data
  })
}

/**
 * 预提醒中订单 -- 获取
 */
export function inRemindOrder(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'remind/inRemindOrder',
    method: 'post',
    data
  })
}

/**
 * 预提醒完成订单 -- 获取
 */
export function remindOrderFinish(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'remind/remindOrderFinish',
    method: 'post',
    data
  })
}

/**
 * 预提醒记录 -- 获取
 */
export function remindRecordInfo(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'remind/remindRecordInfo',
    method: 'post',
    data
  })
}

/**
 * 预提醒记录 -- 导出
 */
export function exportRemindRecordInfo(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'export/exportRemindRecordInfo',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/**
 * 预提醒转派记录 -- 获取
 */
export function remindAllotRecord(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'remind/remindAllotRecord',
    method: 'post',
    data
  })
}
