import store from '@/store'

// 语音管理接口
import request from '@/utils/request'

/**
 * 获取催收等级
 */
export function getCollectionPeriodRuleAll(data) {
  data = data || {}
  data.classify = 'ai_call_config'
  data.columnName = 'collectionLevel'

  return request({
    url: process.env.VUE_APP_BASE_API + 'dataDict/getDataDict',
    method: 'post',
    data
  })
}

/**
 * 语音跟进 -- 获取
 */
export function getAiCallLogStatsByPage(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'call/getAiCallLogStatsByPage',
    method: 'post',
    data
  })
}

/**
 * 任务跟进 -- 获取
 */
export function getAiCallLogCount(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'call/getAiCallLogCount',
    method: 'post',
    data
  })
}

/**
 * 任务跟进 -- 拨打
 */
export function groupCallPlanIVR(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'call/groupCallPlanIVR',
    method: 'post',
    data
  })
}

/**
 * 语音记录 -- 获取
 */
export function getFetchAiCallLogByPage(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'call/fetchAiCallLogByPage',
    method: 'post',
    data
  })
}

/**
 * 策略配置 -- 获取
 */
export function getAiCallConfig(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'callConfig/getAiCallConfig',
    method: 'post',
    data
  })
}

/**
 * 策略配置 -- 添加
 */
export function addAiCallConfig(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'callConfig/addAiCallConfig',
    method: 'post',
    data
  })
}

/**
 * 策略配置 -- 修改
 */
export function updateAiCallConfig(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'callConfig/updateAiCallConfig',
    method: 'post',
    data
  })
}
