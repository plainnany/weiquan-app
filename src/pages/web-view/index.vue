<template>
  <web-view :src="src"></web-view>
</template>

<script>
import Taro from '@tarojs/taro'

const webViewSrcMap = {
  news: '/news.htm', // 消息中心
  help: '/service.htm', // 帮助中心
}

export default {
  data() {
    return {
      src: 'http://www.baidu.com',
    }
  },
  mounted() {
    this.$instance = Taro.getCurrentInstance()
    const params = this.$instance.router.params
    const { type } = params
    this.src = webViewSrcMap[type]
  },
}
</script>
