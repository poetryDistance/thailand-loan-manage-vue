import defaultSettings from '@/settings'

const { tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  tagsView,
  fixedHeader,
  sidebarLogo,
  tableHeight: null
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  CHANGE_TABLE_HEIGHT: (state, data) => {
    state.tableHeight = data
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  changeTableHeight({ commit }, fHeight) {
    const tableHeight = document.documentElement.clientHeight - fHeight - 150
    const data = tableHeight <= 400 ? 400 : tableHeight
    commit('CHANGE_TABLE_HEIGHT', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

