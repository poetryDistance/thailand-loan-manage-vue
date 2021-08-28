// 系统管理接口
import request from '@/utils/request'

/**
 * 角色设置 -- 获取角色
 * @param {Number} page -- 当前页
 * @param {Number} size -- 每页多少条数据
 */
export function getRoleList(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'role/roleList',
    method: 'post',
    data
  })
}

/**
 * 角色设置 -- 添加角色
 * @param {String} name        -- 角色名
 * @param {Array}  permissions -- 角色权限
 */
export function addRole(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'role/addRole',
    method: 'post',
    data
  })
}

/**
 * 角色设置 -- 修改角色 -- 获取角色已有权限
 * @param {Number} id -- 角色id
 */
export function getRolePermission(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'role/getRolePermission',
    method: 'post',
    data
  })
}

/**
 * 角色设置 -- 修改角色 / 删除 / 禁用
 * @param {Number}  id          -- 角色id
 * @param {Array}   permissions -- 角色权限 - 修改
 * @param {boolean} deleted    -- 是否删除
 * @param {boolean} valid     -- 是否启用
 */
export function updateRole(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'role/updateRole',
    method: 'post',
    data
  })
}

/**
 * 角色设置 -- 是否开放通讯录
 */
export function isOpenRoleContact(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'role/isOpenRoleContact',
    method: 'post',
    data
  })
}

/**
 * 账号设置 -- 获取用户
 * @param {Number} page -- 当前页
 * @param {Number} size -- 每页多少条数据
 */
export function getUserList(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'user/getUserList',
    method: 'post',
    data
  })
}

/**
 * 账号设置 -- 验证用户登录名或公司名称是否已存在
 * @param {String} loginName    -- 用户登录名
 * @param {String} merchantName -- 商户名称
 */
export function checkUserLoginName(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'user/checkUserLoginName',
    method: 'post',
    data
  })
}

/**
 * 账号设置 -- 添加用户
 * @param {String} department       -- 部门
 * @param {String} nickName        -- 用户名
 * @param {String} loginName        -- 登录名
 * @param {String} mobile           -- 手机号
 * @param {String} email            -- 邮箱
 * @param {String} roleId           -- 角色
 * @param {String} password         -- 密码
 * @param {String} confirmPassword  -- 确认密码
 */
export function addUser(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'user/addUser',
    method: 'post',
    data
  })
}

/**
 * 账号设置 -- 修改用户
 * @param {String} department       -- 部门
 * @param {String} nickName        -- 用户名
 * @param {String} loginName        -- 登录名
 * @param {String} mobile           -- 手机号
 * @param {String} email            -- 邮箱
 * @param {String} roleId           -- 角色
 * @param {String} password         -- 密码 -- 重置密码
 * @param {String} confirmPassword  -- 确认密码 -- 重置密码
 * @param {String} valid          -- 禁用/启用
 * @param {String} deleted         -- 删除
 */
export function updatePassword(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'user/updateLoginUser',
    method: 'post',
    data
  })
}

/**
 * 商户账号设置 -- 修改账户 / 重置密码 / 添加白名单 / 删除账号
 * @param {String} id               -- 商户id
 * @param {String} merchantAddress  -- 商户地址
 * @param {String} contactsName     -- 联系人名称
 * @param {Number} contactsMobile   -- 联系人手机号
 * @param {String} email            -- 邮箱
 * @param {String} ipgrabType       -- 抓取类型
 * @param {String} modelType        -- 模型算法
 * @param {String} merchantRemark   -- 备注
 * @param {String} password         -- 密码 -- 重置密码
 * @param {String} whitelistIps     -- 白名单 -- 添加白名单
 * @param {String} deleted         -- 删除
 */
export function updateMerchant(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'merchant/updateMerchant',
    method: 'post',
    data
  })
}

/**
 * 催收公司管理 -- 获取公司列表
 * @param {String} companyName: 公司名称
 * @param {Number} page,
 * @param {Number} size
 */
export function getCompany(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'collections/getCompany',
    method: 'post',
    data
  })
}

/**
 * 催收公司管理 -- 验证公司名是否存在
 * @param {String} companyName: 公司名称
 * @param {String} companyId: 公司Id 修改时使用
 */
export function checkCompanyName(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'collections/checkCompanyName',
    method: 'post',
    data
  })
}

/**
 * 催收公司管理 -- 添加公司
 * @param {String} companyName: 公司名称
 * @param {String} loginName: 主管登录名
 * @param {String} email: 邮箱
 * @param {Number} mobile: 手机号
 * @param {String} password: 密码MD5
 */
export function addCompany(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'collections/addCompany',
    method: 'post',
    data
  })
}

/**
 * 催收公司管理 -- 获取公司名
 * @param {String} companyId: 催收公司Id
 */
export function getCompanyName(params) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'collections/getCompanyName',
    method: 'get',
    params
  })
}

/**
 * 催收公司管理 -- 获取公司人员
 * @param {String} companyId: 催收公司Id
 */
export function getCompanyUsers(params) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'collections/getCompanyUsers',
    method: 'get',
    params
  })
}

/**
 * 催收公司管理 -- 修改催收公司 / 删除
 */
export function updateCompany(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'collections/updateCompany',
    method: 'post',
    data
  })
}

/**
 * 系统设置 -- 获取
 */
export function getSysParam(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'user/getSysParam',
    method: 'post',
    data
  })
}

/**
 * 系统设置 -- 添加
 */
export function addSysParam(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'user/addSysParam',
    method: 'post',
    data
  })
}

/**
 * 系统设置 -- 修改
 */
export function updateSysParam(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'user/updateSysParam',
    method: 'post',
    data
  })
}

/**
 * 系统设置 -- 删除
 */
export function delSysParam(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'user/delSysParam',
    method: 'post',
    data
  })
}

/**
 * 获取服务器时间
 */
export function currentTimeMillis(params) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/customer/currentTimeMillis',
    method: 'get',
    params
  })
}

/**
 * 还款账号管理 -- 获取
 */
export function getAccountInfo(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'repayAccount/getAccountInfo',
    method: 'post',
    data
  })
}

/**
 * 还款账号管理 -- 添加
 */
export function addRepayAccount(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'repayAccount/addRepayAccount',
    method: 'post',
    data
  })
}

/**
 * 还款账号管理 -- 修改
 */
export function updateRepayAccount(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'repayAccount/updateRepayAccount',
    method: 'post',
    data
  })
}

/**
 * 海贝风控配置 -- 获取
 */
export function getHaibeiRiskConfig(params) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'haibeiRiskConfig/list',
    method: 'get',
    params
  })
}

/**
 * 海贝风控配置 -- 修改
 */
export function haibeiRiskConfigUpdate(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + 'haibeiRiskConfig/update',
    method: 'post',
    data
  })
}
