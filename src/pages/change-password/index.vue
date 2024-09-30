<template>
  <view class="change-password">
    <view class="change-password-title" v-if="isDianZhang">
      <text class="img"></text>
      <text>管理员密码设置</text>
    </view>
    <view class="common-card">
      <input v-model.trim="originManagerPassword" type="password" placeholder="原密码（6-13位数字+字母）" />
    </view>
    <view class="common-card">
      <input v-model.trim="managerPassword" type="password" placeholder="新密码（6-13位数字+字母）" />
    </view>
    <view class="common-card">
      <input v-model.trim="confirmManagerPassword" type="password" placeholder="确认新密码" />
    </view>
    <view class="error-tip" v-if="validatePassword('manager')">{{ managerErrorTip }}</view>

    <!-- <view class="common-card">
      <input v-model.trim="originAssistantPassword" placeholder="原密码（6-13位数字+字母）" />
    </view> -->
    <view v-if="isDianZhang">
      <view class="change-password-title">
        <text class="img"></text>
        <text>店员密码设置</text>
      </view>
      <view class="common-card">
        <input v-model.trim="assistantPassword" type="password" placeholder="新密码（6-13位数字+字母）" />
      </view>
      <view class="common-card">
        <input v-model.trim="confirmAssistantPassword" type="password" placeholder="确认新密码" />
      </view>
      <view class="error-tip" v-if="validatePassword('assistant')">{{ assistantErrorTip }}</view>
    </view>
    <nan-button type="primary" :loading="loading" @tap="onConfirm">确认修改</nan-button>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { setTitle } from '@/utils'
import crypto from 'crypto-js'

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
      return !this.managerPassword || this.managerPassword !== this.confirmManagerPassword
    },
    isDianZhang() {
      return this.$store.state.userInfo.dianZhang
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
      if (this.disabled) {
        Taro.showToast({
          title: '密码不能为空',
          icon: 'error',
        })
        return
      }

      this.loading = true
      // 原密码
      const oldPassword = crypto.AES.encrypt(this.originManagerPassword, '30886A121CEDEFDE3ED765311F89964C').toString()
      // 店长密码
      const password = crypto.AES.encrypt(this.managerPassword, '30886A121CEDEFDE3ED765311F89964C').toString()
      // 店员密码
      const staffPassword = crypto.AES.encrypt(this.assistantPassword, '30886A121CEDEFDE3ED765311F89964C').toString()
      debugger

      const params = this.isDianZhang
        ? {
            oldPassword,
            password,
            staffPassword,
          }
        : {
            oldPassword,
            staffPassword: password,
          }
      this.$API
        .passwordReset(params)
        .then(() => {
          Taro.navigateTo({ url: '/pages/bind-account/index' })
        })
        .catch(err => {
          Taro.showToast({
            title: err.msg,
            icon: 'error',
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="less">
@bg: rgb(240, 242, 245);

.change-password {
  background: @bg;
  font-size: 32px;
  padding: 40px 30px;
  box-sizing: border-box;
  min-height: 100vh;

  &-title {
    color: #666;
    margin: 36px 0;
    display: flex;
    align-items: center;
  }

  .error-tip {
    color: #ff4d4f;
    margin-bottom: 30px;
    padding-left: 20px;
  }

  button {
    margin-top: 50px;
    font-size: 32px;
  }

  .img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #ccc;
    margin-right: 12px;
  }
}
</style>
