import store from '@/store'

// 还款管理接口
import request from '@/utils/request'

/**
 * 还款分期表 获取还款分期
 */
export function getBorrowPeriodInfo(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'borrow/getBorrowPeriodInfo',
    method: 'post',
    data
  })
}

/**
 * 还款分期表 获取还款链接
 */
export function createPayLink(params) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'borrow/createPayLink',
    method: 'get',
    params
  })
}
