import router, { constantRoutes } from '@/router'
import Layout from '@/layout'
import { uppercaseFirst } from '@/filters/index'

/**
 * 过滤异步路由表
 * @param routeInfo 后台返回的路由信息
 */
export function filterAsyncRoutes(dispatch, routeInfo) {
  routeInfo.sort(function(a, b) {
    return a.sort - b.sort
  })
  const res = []
  routeInfo.forEach(item => {
    const tmp = {}
    if (item.url === '/myDesk') {
      tmp.path = '/'
      tmp.redirect = (item.child ? item.child[0].url : '')
    } else {
      tmp.path = item.url
      tmp.redirect = item.url + (item.child ? item.child[0].url : '')
    }
    tmp.component = Layout
    tmp.alwaysShow = true
    tmp.name = uppercaseFirst(item.url.substring(1))
    tmp.meta = { title: item.url.slice(1), icon: item.iconClass }

    if (item.child) {
      item.child.sort(function(a, b) {
        return a.sort - b.sort
      })
      tmp.children = []
      item.child.forEach(val => {
        if (val.url === '/profileData') {
          tmp.children.push({
            path: val.url.slice(1),
            meta: { title: val.url.slice(1), icon: '', affix: true },
            name: uppercaseFirst(val.url.substring(1)),
            component: () => import('@/views/myDesk/profileData')
          })
        } else {
          tmp.children.push({
            path: val.url.slice(1),
            meta: { title: val.url.slice(1), icon: '' },
            name: uppercaseFirst(val.url.substring(1)),
            component: resolve => require([`@/views${item.url + val.url}`], resolve)
          })
        }
      })
      res.push(tmp)
    } else {
      res.push(tmp)
    }
  })
  res.forEach(item => {
    if (item.path === '/aiCallManage') {
      item.children.push({
        path: '/taskFollowUp/:id',
        name: 'taskFollowUp',
        hidden: true,
        component: () => import('@/views/aiCallManage/taskFollowUp'),
        meta: { title: 'taskFollowUp', icon: '', affix: false }
      })
    }
  })
  if (res.every(val => val.path !== '/')) {
    res.unshift({
      path: '/',
      component: Layout
    })
  }
  return res
}

const state = {
  routes: [],
  addRoutes: [],
  permission: {},
  ids: {}
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    router.options.routes = state.routes
    router.addRoutes(state.routes)
  },
  PERMISSION: (state, data) => {
    state.permission = data
  },
  IDS: (state, data) => {
    state.ids = data
  }
}

const actions = {
  generateRoutes({ commit, dispatch }, routeInfo) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(dispatch, routeInfo)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  getPermission({ commit }, loginInfo) {
    commit('PERMISSION', {
      // 是否是管理账号
      isAdmin: loginInfo.userType === 10,
      // 是否是主管
      isCollectionLead: loginInfo.isCollectionLead || false,
      // 是否是组长
      isGroupLead: loginInfo.isGroupLead || false,
      // 是否是催收员
      isCollectionUser: loginInfo.isCollectionUser || false
    })
    commit('IDS', {
      collectionCompanyId: loginInfo.collectionCompanyId,
      collectionGroupId: loginInfo.collectionGroupId
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
