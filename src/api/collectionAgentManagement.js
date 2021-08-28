// 催收管理接口
import request from '@/utils/request'

/**
 * 获取催分组列表
 */
export function getGroupInfo(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/getGroupInfo',
    method: 'post',
    data
  })
}

/**
 * 获取催收公司所有组
 * @param {String} companyId 催收公司Id
 */
export function getCompanyGroup(params) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/getCompanyGroup',
    method: 'get',
    params
  })
}

/**
 * 验证催收组是否存在
 * @param {String} companyId 催收公司Id
 * @param {String} groupId 催收组Id
 * @param {String} groupName 催收组
 */
export function checkGroupName(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/checkGroupName',
    method: 'post',
    data
  })
}

/**
 * 新增组
 * @param {String} companyId 催收公司Id
 * @param {String} collectionLenderUserId 催收组长Id
 * @param {String} groupName 催收组
 */
export function addCollectionGroup(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/addCollectionGroup',
    method: 'post',
    data
  })
}

/**
 * 分组设置 -- 获取当前组下的成员
 * @param {String} companyId 催收公司Id
 * @param {String} collectionLenderUserId 催收组长Id
 * @param {String} groupName 催收组
 */
export function getGroupCollectionUser(params) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/getGroupCollectionUser',
    method: 'get',
    params
  })
}

/**
 * 分组设置 -- 修改组
 * @param {String} companyId 催收公司Id
 * @param {String} collectionLenderUserId 催收组长Id
 * @param {String} groupName 催收组
 */
export function updateGroup(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/updateGroup',
    method: 'post',
    data
  })
}

/**
 * 自动派单 -- 获取规则列表
 * @param {Number} companyId 催收公司Id
 * @param {String} groupName 催收组
 * @param {Number} page 当前页
 * @param {Number} size 每页数据数
 */
export function groupRules(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/groupRules',
    method: 'post',
    data
  })
}

/**
 * 自动派单 -- 验证规则是否存在
 * @param {Number} companyId 催收公司Id
 * @param {Number} groupId  组id
 * @param {Number} maxDay  账期最大天数
 * @param {Number} minDay  账期最小天数
 * @param {String} remark   说明
 * @param {Number} enable   是否自动派单
 */
export function checkGroupRules(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/checkGroupRules',
    method: 'post',
    data
  })
}

/**
 * 自动派单 -- 新增规则
 * @param {Number} companyId 催收公司Id
 * @param {Number} groupId  组id
 * @param {Number} maxDay  账期最大天数
 * @param {Number} minDay  账期最小天数
 * @param {String} remark   说明
 * @param {Number} enable   是否自动派单
 */
export function addGroupRules(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/addGroupRules',
    method: 'post',
    data
  })
}

/**
 * 自动派单 -- 修改规则
 * @param {Number} companyId 催收公司Id
 * @param {Number} groupId  组id
 * @param {Number} maxDay  账期最大天数
 * @param {Number} minDay  账期最小天数
 * @param {String} remark   说明
 * @param {Number} enable   是否自动派单
 */
export function updateGroupRules(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/updateGroupRules',
    method: 'post',
    data
  })
}

/**
 * 自动派单 -- 删除规则
 * @param {Number} id 规则id
 */
export function deleteRules(params) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/deleteRules',
    method: 'get',
    params
  })
}

/**
 * 催收员列表 -- 获取
 * @param {Number} id 规则id
 */
export function collectionUserInfo(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/collectionUserInfo',
    method: 'post',
    data
  })
}

/**
 * 催收员列表 -- 添加催收员
 * @param {Number} collectionCompanyId 公司id
 * @param {Number} collectionGroupId 组id
 * @param {Number} loginName 登录名
 * @param {Number} mobile 手机号
 * @param {Number} email 邮箱
 * @param {Number} password 密码
 * @param {Number} remark 备注
 */
export function addCollectionUser(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/addCollectionUser',
    method: 'post',
    data
  })
}

/**
 * 催收员列表 -- 修改催收员
 * @param {Number} collectionCompanyId 公司id
 * @param {Number} collectionGroupId 组id
 * @param {Number} loginName 登录名
 * @param {Number} mobile 手机号
 * @param {Number} email 邮箱
 * @param {Number} password 密码
 * @param {Number} remark 备注
 */
export function updateCollectionUser(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'group/updateCollectionUser',
    method: 'post',
    data
  })
}
