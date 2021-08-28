// 风控管理接口
import request from '@/utils/request'

/**
 * 风控配置 -- 获取
 */
export function getProductRisks(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/getProductRisks',
    method: 'post',
    data
  })
}

/**
 * 风控配置 -- 添加时获取可以添加的产品名称
 */
export function getNoRiskProduct(parmas) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/getNoRiskProduct',
    method: 'get',
    parmas
  })
}

/**
 * 风控配置 -- 添加
 */
export function addProductRisk(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/addProductRisk',
    method: 'post',
    data
  })
}

/**
 * 风控配置 -- 修改
 */
export function updateProductRisk(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/updateProductRisk',
    method: 'post',
    data
  })
}

/**
 * 风控配置 -- 删除
 */
export function delProductRisk(params) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'risk/delProductRisk',
    method: 'get',
    params
  })
}
