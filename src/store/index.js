import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/service/api'

Vue.use(Vuex)

const state = {
  userInfo: {},
  switchCategoryTab: '',
  bindStatus: false, // 是否跳转过绑定用户页面
}

const getters = {}
const mutations = {
  setUserInfo(state, data) {
    state.userInfo = data
  },
  setSwitchCategoryTab(state, data) {
    state.switchCategoryTab = data
  },
  setBindStatus(state, data) {
    state.bindStatus = data
  },
}

const actions = {
  getUserInfo({ commit }) {
    return API.getUserInfo().then(data => {
      commit('setUserInfo', data)
    })
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})
