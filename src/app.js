import Vue from 'vue'
import NanModal from '@/components/modal'
import NanButton from '@/components/button'
import './app.less'
import API from '@/service/api'

Vue.component('nan-modal', NanModal)
Vue.component('nan-button', NanButton)

Vue.prototype.$API = API

const App = {
  onShow(options) {},
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  },
}

export default App
