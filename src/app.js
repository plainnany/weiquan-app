import Vue from 'vue'
import NanModal from '@/components/modal'
import NanButton from '@/components/button'
import './app.less'

Vue.component('nan-modal', NanModal)
Vue.component('nan-button', NanButton)

const App = {
  onShow(options) {},
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  },
}

export default App
