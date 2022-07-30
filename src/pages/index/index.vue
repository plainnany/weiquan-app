<template>
  <view class="index">
    <text>测试接口数据 {{ msg }}</text>
  </view>
</template>

<script>
import './index.less'
import API from '@/service/api'

export default {
  data() {
    return {
      msg: '',
    }
  },
  mounted() {
    API.getDetail().then(res => {
      this.msg = res.message
    })
  },
}
</script>
