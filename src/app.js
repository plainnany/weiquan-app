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

const App = {
  store,
  onShow() {
    Taro.checkSession({
      success(res) {
        console.log(res, '登录有效')
      },
      fail(res) {
        console.log(res, '登录失效')
        Taro.login({
          success(res) {
            Taro.setStorageSync('code', res.code)
            API.getOpenId({
              jsCode: res.code,
            }).then(data => {
              const { unionid } = data
              Taro.setStorageSync('unionId', unionid)
            })
            console.log(res, res.code)
          },
          fail(err) {
            console.log(err)
          },
        })
      },
    })
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  },
}

export default App
