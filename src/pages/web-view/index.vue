<template>
  <web-view :src="url"></web-view>
</template>

<script>
import Taro from '@tarojs/taro'

// const webViewSrcMap = {
//   news: 'http://124.222.65.228:8080/news.htm', // 消息中心
//   help: 'http://124.222.65.228:8080/service.htm', // 帮助中心
// }

export default {
  data() {
    return {
      url: '',
    }
  },
  mounted() {},
  onShow() {
    this.$instance = Taro.getCurrentInstance()
    const params = this.$instance.router.params
    const url = decodeURIComponent(params.url)
    const token = Taro.getStorageSync('token')
    const code = this.$store.state.userInfo.userId
    if (code) {
      if (url.includes('?')) {
        this.url = `${url}&customerCode=${code}`
      } else {
        this.url = `${url}?customerCode=${code}`
      }
    } else {
      this.url = url
    }
  },
}
</script>
