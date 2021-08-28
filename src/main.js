import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import '@/icons' // icon
import '@/permission' // permission control
import packageJson from '../package.json'

import * as filters from './filters' // global filters

// echart
import echarts from 'echarts'
Vue.prototype.$echart = echarts

// 缓存方法
import { localData, sessionData } from '@/utils/local'
Vue.prototype.localData = localData
Vue.prototype.sessionData = sessionData

// 清除浏览器缓存
Vue.prototype.$clearAllCaches = () => {
  // 清除所有cookie
  const date = new Date()
  date.setTime(date.getTime() - 10000)
  const keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    keys.forEach(item => {
      Cookies.remove(item)
    })
  }
  // 清除所有 sessionStorage 和 localStorage
  sessionStorage.clear()
}
// 项目版本号更改时删除缓存
const version = packageJson.version
console.log('当前版本: V' + version)
const localVersion = localStorage.getItem('projectVersion')
if (!localVersion || version !== localVersion) {
  console.log('版本更新，清除缓存')
  Vue.prototype.$clearAllCaches()
  localStorage.clear()
  window.location.reload()
  localStorage.setItem('projectVersion', version)
}

// 生成路由
const loginInfo = sessionData('get', 'login_user') || {}
if (loginInfo.permissions) {
  store.dispatch('permission/generateRoutes', loginInfo.permissions)
  store.dispatch('app/setLanguage', sessionData('get', 'language') || 'zh')

  // 判断权限
  store.dispatch('permission/getPermission', loginInfo)

  // 是否是管理账号
  store.dispatch('jurisdiction/getIsAdmin', loginInfo.userType === 10)
  // 是否是主管
  store.dispatch('jurisdiction/getIsCollectionLead', loginInfo.isCollectionLead)
  // 是否是组长
  store.dispatch('jurisdiction/getIsGroupLead', loginInfo.isGroupLead)
  // 是否是催收员
  store.dispatch('jurisdiction/getIsCollectionUser', loginInfo.isCollectionUser)
}
if (loginInfo.userType === 10) {
  // 获取所有公司名和id
  store.dispatch('options/getCompanyNameOptions')
  // 获取所有市场类型
  store.dispatch('options/getMarketTypeOptions')
  // 获取所有催收等级
  store.dispatch('options/getCollectionLevelOptions')
}

// 判断是否存在某个页面 (permissionCode)
Vue.prototype.isView = function(permissionCode) {
  const loginUser = sessionData('get', 'login_user') || {}
  return loginUser.permissions.some(item => item.child.some(val => val.permissionCode === permissionCode))
}

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
Vue.use(ElementUI, {
  size: sessionData('get', 'size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// 注册全局实用程序筛选器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// eslint-disable-next-line no-extend-native
Date.prototype.Format = (fmt) => {
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

// 加密私钥和iv
Vue.prototype.keys = 'Yu4QO83e0pXiWqDI'
Vue.prototype.ivStr = 'wLRDzFC4YJ07kzC0'

// 设置当前市场id
const currentMarketId = sessionData('get', 'currentMarketId')
if (currentMarketId) {
  store.dispatch('app/setMarketId', currentMarketId * 1)
}

const lang = sessionData('get', 'language') || 'zh'
if (lang === 'zh') {
  document.title = '泰国后台管理系统'
} else if (lang === 'en') {
  document.title = 'Thailand back-end management system'
} else if (lang === 'es') {
  document.title = 'Sistema de gestión Back-End tailandia'
} else if (lang === 'th') {
  document.title = ''
}

Vue.prototype.$lang = lang

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
