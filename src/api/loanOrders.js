import store from '@/store'

// 结算管理接口
import request from '@/utils/request'

/**
 * 放款管理 -- 获取
 */
export function forLending(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'loanOrders/forLending',
    method: 'post',
    data
  })
}

/**
 * 放款管理 -- 放款
 */
export function loanOperation(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'loanOrders/loanOperation',
    method: 'post',
    data
  })
}

/**
 * 放款管理 -- 导出待放款单
 */
export function exportForLending(data) {
  // const data = item || {}
  // if (store.getters.currentMarketId) {
  //   data.marketType = store.getters.currentMarketId
  // }

  return request({
    url: process.env.VUE_APP_BASE_API + 'export/exportForLending',
    method: 'post',
    responseType: 'blob',
    data
  })
}

/**
 * 放款管理 -- 导入放款结果
 */
export function financialUpload(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'export/financialUpload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    processData: false,
    data
  })
}

/**
 * 还款管理 -- 获取
 */
export function getRepaymentRecord(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'loanOrders/repaymentRecord',
    method: 'post',
    data
  })
}
