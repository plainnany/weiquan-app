<template>
  <view class="change-receive-code">
    <view class="common-card"> 原收货码 {{ originCode }} </view>
    <view class="common-card">
      <input v-model="code" placeholder="新收货码(6位数字)" />
    </view>
    <nan-button type="primary" :loading="loading" :disabled="disabled" @tap="onConfirm">确认修改</nan-button>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { setTitle } from '@/utils'

export default {
  components: {},
  data() {
    return {
      originCode: '',
      code: '',
      loading: false,
    }
  },
  computed: {
    disabled() {
      return !this.code
    },
  },
  mounted() {
    setTitle({ title: '修改门店收货码' })
    this.originCode = this.$store.state.userInfo.recieveCode
  },
  methods: {
    onConfirm() {
      this.loading = true
      this.$API
        .updateRecieveCode({
          recieveCode: this.code,
        })
        .then(data => {
          if (data) {
            Taro.navigateBack({
              delta: 1,
            })
          }
        })
        .finally(() => {
          thi.loading = false
        })
    },
  },
}
</script>

<style lang="less">
.change-receive-code {
  background: #f8f9fa;
  font-size: 28px;
  padding: 40px 30px;
  box-sizing: border-box;
  min-height: 100vh;

  button {
    margin-top: 50px;
  }
}
</style>
