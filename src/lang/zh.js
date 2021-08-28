import route from './zh/route'
import common from './zh/common'
import sysManage from './zh/sysManage'
import collector from './zh/collector'
import collect from './zh/collect'
import borrow from './zh/borrow'
import userManage from './zh/userManage'
import financial from './zh/financial'
import risk from './zh/risk'
import loanMarket from './zh/loanMarket'
import theData from './zh/theData'
import loanOrders from './zh/loanOrders'

export default {
  route,
  login: {
    title: '系统登录',
    logIn: '登录',
    userName: '账号',
    password: '密码',
    validateCode: '验证码',
    iptUserName: '请输入用户名',
    pwdNumber: '密码不能少于6位',
    iptVaildateCode: '请输入验证码'
  },
  navbar: {
    home: '首页',
    logOut: '退出登录',
    profile: '个人中心',
    sidebarLogo: '泰国后台管理系统\xa0\xa0',
    langSelect: '选择语言',
    currentTimeMillis: '服务器时间',
    getServerTime: '点击获取服务器时间',
    getSuccess: '获取成功'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
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
