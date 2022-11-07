import Vue from 'vue'
import NanModal from '@/components/modal'
import NanButton from '@/components/button'
import './app.less'
import API from '@/service/api'
import Taro from '@tarojs/taro'
import store from '@/store'

Vue.component('nan-modal', NanModal)
Vue.component('nan-button', NanButton)

Vue.prototype.$API = API

function getBindShopList(unionId) {
  API.getBindShopList({
    unionId,
  })
    .then(data => {
      const token = ((data || []).find(v => v.useflg === '01') || {}).token
      Taro.setStorageSync('token', token)
      store.dispatch('getUserInfo')
    })
    .catch(err => {
      Taro.showToast({
        title: err.msg,
        icon: 'none',
      })
    })
}

function login() {
  Taro.login({
    success(res) {
      Taro.setStorageSync('code', res.code)
      API.getOpenId({
        jsCode: res.code,
      }).then(data => {
        const { unionid } = data
        Taro.setStorageSync('unionId', unionid)
        getBindShopList(unionid)
      })
      console.log(res.code)
    },
    fail(err) {
      console.log(err)
    },
  })
}

const App = {
  store,
  onShow() {
    Taro.checkSession({
      success(res) {
        const sessionCode = Taro.getStorageSync('code')
        const sessionUnionId = Taro.getStorageSync('unionId')
        if (!sessionCode || !sessionUnionId) {
          login()
        } else {
          console.log(res, '登录有效')
          getBindShopList(sessionUnionId)
        }
      },
      fail(res) {
        console.log(res, '登录失效')
        login()
      },
    })
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  },
}

export default App
