<template>
  <view class="account-modify">
    <view class="form">
      <view class="label">{{ title }}: </view>
      <view class="content">
        <input v-model="userInfo[key]" :placeholder="userInfo[key]" />
      </view>
    </view>

    <nan-button type="primary" @tap="handleConfirm">确认修改</nan-button>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './index.less'
import { setTitle } from '@/utils'

export default {
  components: {},
  data() {
    return {
      key: '',
      title: '',
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  mounted() {
    const { title, key } = Taro.getCurrentInstance().router.params
    this.key = key
    this.title = title
    setTitle({ title: `${title}修改` })
  },
  methods: {
    handleConfirm(item) {},
  },
}
</script>
