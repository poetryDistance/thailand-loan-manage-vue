import { sessionData } from '@/utils/local'
import { getLanguage } from '@/lang/index'

const state = {
  sidebar: {
    opened: sessionData('get', 'sidebarStatus') ? !!+sessionData('get', 'sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: getLanguage(),
  size: sessionData('get', 'size') || 'medium',
  currentMarketId: null
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      sessionData('set', 'sidebarStatus', 1)
    } else {
      sessionData('set', 'sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    sessionData('set', 'sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  OPEN_SIDEBAR: (state, opened) => {
    sessionData('set', 'sidebarStatus', 1)
    state.sidebar.opened = opened
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    sessionData('set', 'language', language)
  },
  SET_SIZE: (state, size) => {
    state.size = size
    sessionData('set', 'size', size)
  },
  SET_MARKET_ID: (state, currentMarketId) => {
    state.currentMarketId = currentMarketId
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  openSideBar({ commit }, { opened }) {
    commit('OPEN_SIDEBAR', opened)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit, dispatch }, language) {
    // 账户状态
    dispatch('options/getIsValidOptions', {}, { root: true })
    // 用户类型
    dispatch('options/getUserTypeOptions', {}, { root: true })
    // 模型分类型
    dispatch('options/getModelTypeOptions', {}, { root: true })
    // 期单位类型
    dispatch('options/getPeriodUnitOptions', {}, { root: true })

    commit('SET_LANGUAGE', language)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setMarketId({ commit }, currentMarketId) {
    commit('SET_MARKET_ID', currentMarketId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
