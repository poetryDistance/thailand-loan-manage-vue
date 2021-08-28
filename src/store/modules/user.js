import { login, logout } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  name: '',
  avatar: ''
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password, validateCode } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: userName.trim(), password: password, validateCode: validateCode }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }, that) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        that.$clearAllCaches()
        resetRouter()
        // 重置访问的视图和缓存的视图
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
