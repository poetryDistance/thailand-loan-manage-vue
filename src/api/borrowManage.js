import store from '@/store'

// 借款管理接口
import request from '@/utils/request'

/**
 * 贷款订单表 / 人工入账 -- 获取贷款订单
 */
export function getBorrowInfo(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'borrow/getBorrowInfo',
    method: 'post',
    data
  })
}

/**
 * 贷款订单表 -- 获取费用变更
 */
export function getBorrowBill(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'borrow/getBorrowBill',
    method: 'post',
    data
  })
}

/**
 * 贷款订单表 -- 获取通话记录
 */
export function getCustomerCallRecords(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'borrow/getCustomerCallRecords',
    method: 'post',
    data
  })
}

/**
 * 贷款订单表 -- 获取通讯录
 */
export function getCustomerContacts(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'borrow/getCustomerContacts',
    method: 'post',
    data
  })
}

/**
 * 贷款订单表 -- 审核
 */
export function loanReview(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/customer/loanReview',
    method: 'post',
    data
  })
}

/**
 * 待人审订单 -- 获取
 */
export function loanReviewInfo(item) {
  const data = item || {}
  if (store.getters.currentMarketId) {
    data.marketType = store.getters.currentMarketId
  }

  return request({
    url: process.env.VUE_APP_BASE_API + 'borrow/loanReviewInfo',
    method: 'post',
    data
  })
}
