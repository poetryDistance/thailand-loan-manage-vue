import store from '@/store'

// 财务管理接口
import request from '@/utils/request'

/**
 * 人工入账
 */
export function offlinePayment(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'payment/offlinePayment',
    method: 'post',
    data
  })
}

/**
 * 人工入账流水
 */
export function bookedRecord(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'payment/bookedRecord',
    method: 'post',
    data
  })
}
