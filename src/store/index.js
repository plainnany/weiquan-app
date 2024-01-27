import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/service/api'

Vue.use(Vuex)

const state = {
  userInfo: {},
  switchCategoryTab: '',
  bindStatus: false, // 是否跳转过绑定用户页面
  deliverTime: null, // 确认订单时间，由于页面互相跳转，页面传参困难，使用store来传递
  currentProduct: {}, // 当前选中需要配送时间的产品
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
  setDeliverTime(state, data) {
    state.deliverTime = data
  },
  setCurrentProduct(state, data) {
    state.currentProduct = data
  },
}

const actions = {
  getUserInfo({ commit }) {
    return API.getUserInfo().then(data => {
      // 当前用户，是否可以显示价格
      // 现金用户&店长&priceFlag: 01
      const userInfo = {
        ...data,
        showParentPay: data.parentPayFlg === '01', // 是否显示总部余额
        showPrice: data.dianZhang && data.priceFlag === '01' && data.accountType === '01',
      }
      commit('setUserInfo', userInfo)
    })
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})
