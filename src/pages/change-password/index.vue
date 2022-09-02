<template>
  <view class="change-password">
    <view class="change-password-title">店长密码设置</view>
    <view class="common-card">
      <input v-model.trim="originManagerPassword" placeholder="原密码" />
    </view>
    <view class="common-card">
      <input v-model.trim="managerPassword" type="password" placeholder="新密码" />
    </view>
    <view class="common-card">
      <input v-model.trim="confirmManagerPassword" type="password" placeholder="确认新密码" />
    </view>
    <view class="error-tip" v-if="validatePassword('manager')">{{ managerErrorTip }}</view>
    <view class="change-password-title">店员密码设置</view>
    <view class="common-card">
      <input v-model.trim="originAssistantPassword" placeholder="原密码" />
    </view>
    <view class="common-card">
      <input v-model.trim="assistantPassword" type="password" placeholder="新密码" />
    </view>
    <view class="common-card">
      <input v-model.trim="confirmAssistantPassword" type="password" placeholder="确认新密码" />
    </view>
    <view class="error-tip" v-if="validatePassword('assistant')">{{ assistantErrorTip }}</view>
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
      originManagerPassword: '',
      confirmManagerPassword: '',
      managerPassword: '',
      originAssistantPassword: '',
      confirmAssistantPassword: '',
      assistantPassword: '',
      loading: false,
      showErrorTip: false,
      managerErrorTip: '',
      assistantErrorTip: '',
    }
  },
  computed: {
    disabled() {
      return (
        !this.managerPassword ||
        !this.assistantPassword ||
        this.managerPassword !== this.confirmManagerPassword ||
        this.assistantPassword !== this.confirmAssistantPassword
      )
    },
  },
  mounted() {
    setTitle({ title: '修改密码' })
  },
  methods: {
    validatePassword(type) {
      if (type === 'manager') {
        if (this.managerPassword && this.confirmManagerPassword && this.managerPassword !== this.confirmManagerPassword) {
          this.managerErrorTip = '密码不一致'
          return true
        }
      } else if (type === 'assistant') {
        if (this.assistantPassword && this.confirmAssistantPassword && this.assistantPassword !== this.confirmAssistantPassword) {
          this.assistantErrorTip = '密码不一致'
          return true
        }
      }

      return false
    },

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
.change-password {
  background: #f8f9fa;
  font-size: 28px;
  padding: 40px 30px;
  box-sizing: border-box;
  min-height: 100vh;

  &-title {
    color: #666;
    margin-bottom: 30px;
  }

  .error-tip {
    color: #ff4d4f;
    margin-bottom: 30px;
    padding-left: 20px;
  }

  button {
    margin-top: 50px;
  }
}
</style>
