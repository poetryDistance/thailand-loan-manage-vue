import route from './en/route'
import common from './en/common'
import sysManage from './en/sysManage'
import collector from './en/collector'
import collect from './en/collect'
import borrow from './en/borrow'
import userManage from './en/userManage'
import financial from './en/financial'
import risk from './en/risk'
import loanMarket from './en/loanMarket'
import theData from './en/theData'
import loanOrders from './en/loanOrders'

export default {
  route,
  login: {
    title: 'System Login', /* 系统登录 */
    logIn: 'Login', /* 登录 */
    userName: 'User Nmae', /* 账号 */
    password: 'Password', /* 密码 */
    validateCode: 'Verification Code', /* 验证码 */
    iptUserName: 'Enter User Name', /* 请输入用户名 */
    pwdNumber: 'The password cannot be less than 6 characters', /* 密码不能少于6位 */
    iptVaildateCode: 'Please enter the correct code' /* 请输入验证码 */
  },
  navbar: {
    home: 'Home', /* 首页 */
    logOut: 'Log out', /* 退出登录 */
    profile: 'My center', /* 个人中心 */
    sidebarLogo: 'Thailand back-end management system', /* 泰国后台管理系统 */
    langSelect: 'Select Language', /* 选择语言 */
    currentTimeMillis: '', /* 服务器时间 */
    getServerTime: '', /* 点击获取服务器时间 */
    getSuccess: '', /* 获取成功 */

  },
  tagsView: {
    refresh: 'Refresh', /* 刷新 */
    close: 'Close', /* 关闭 */
    closeOthers: 'Close Others', /* 关闭其它 */
    closeAll: 'Close All' /* 关闭所有 */
  },
  common,
  sysManage,
  collector,
  collect,
  borrow,
  userManage,
  financial,
  risk,
  loanMarket,
  theData,
  loanOrders
}
