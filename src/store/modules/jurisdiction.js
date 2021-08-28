const state = {
  // 是否是管理账号
  isAdmin: [],
  // 是否是主管
  isCollectionLead: [],
  // 是否是组长
  isGroupLead: [],
  // 是否是催收员
  isCollectionUser: []
}

const mutations = {
  IS_ADMIN: (state, data) => {
    state.isAdmin = data
  },
  IS_COLLECTION_LEAD: (state, data) => {
    state.isCollectionLead = data
  },
  IS_GROUP_LEAD: (state, data) => {
    state.isGroupLead = data
  },
  IS_COLLECTION_USER: (state, data) => {
    state.isCollectionUser = data
  }
}

const actions = {
  getIsAdmin({ commit }, flag) {
    commit('IS_ADMIN', flag)
  },
  getIsCollectionLead({ commit }, flag) {
    commit('IS_COLLECTION_LEAD', flag)
  },
  getIsGroupLead({ commit }, flag) {
    commit('IS_GROUP_LEAD', flag)
  },
  getIsCollectionUser({ commit }, flag) {
    commit('IS_COLLECTION_USER', flag)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

