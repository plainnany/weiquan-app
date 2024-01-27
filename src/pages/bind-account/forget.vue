<template>
  <view class="forget-page">
    <view class="form-item mobile">
      <input type="text" v-model="form.mobile" placeholder="手机号码" />
      <nan-button class="send" type="primary" @tap="sendCode">{{
        sending ? `${countDown}s` : reSend ? '重新获取' : '获取验证码'
      }}</nan-button>
    </view>
    <view class="form-item">
      <input type="text" v-model="form.mobileCode" placeholder="验证码" />
    </view>
    <view class="form-item">
      <input type="text" v-model="form.userId" placeholder="门店编码（手机号未绑定多家门店可不填）" />
    </view>
    <view class="form-item">
      <input type="password" v-model="form.password" placeholder="新密码（6-13位数字+字母）" />
    </view>
    <view class="form-item">
      <input type="password" v-model="form.confirmPassword" placeholder="确认新密码" />
    </view>
    <view class="footer">
      <nan-button type="primary" @tap="onConfirm" :loading="btnLoading">确认修改</nan-button>
    </view>
    <view class="common-toast" v-if="errorToast.visible && errorToast.message">
      <text>{{ errorToast.message }}</text></view
    >
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { setTitle } from '@/utils'
import crypto from 'crypto-js'
import './index.less'
import './forget.less'
import ToastMixin from '@/mixin/toast'

export default {
  name: 'user',
  components: {},
  mixins: [ToastMixin],
  data() {
    return {
      form: {
        mobile: '',
        mobileCode: '',
        userId: '', // 门店编码
        password: '',
        confirmPassword: '',
      },
      countDown: 60,
      sending: false,
      btnLoading: false,
      reSend: false,
    }
  },
  mounted() {
    setTitle({ title: '忘记密码' })
    try {
      const unionId = Taro.getStorageSync('unionId')
      this.unionId = unionId
    } catch (e) {}
  },
  methods: {
    message(title) {
      this.showToast({ msg: title })
    },
    sendCode() {
      if (!/^1[3-9][0-9]{9}$/.test(this.form.mobile)) {
        return this.message('手机号错误')
      }
      if (this.sending) {
        return
      }
      this.sending = true
      this.$API
        .sendCode({
          mobileTel: this.form.mobile,
          smsType: 2,
        })
        .then(data => {
          this.countDown--
          this.startCountDown()
        })
        .catch(err => {
          this.sending = false
          this.message(err.msg)
        })
    },
    startCountDown() {
      this.timer = setTimeout(() => {
        this.countDown--
        if (this.countDown === 0) {
          clearTimeout(this.timer)
          this.countDown = 60
          this.sending = false
          this.reSend = true
        } else {
          this.startCountDown()
        }
      }, 1000)
    },
    onConfirm() {
      if (!this.form.mobile) {
        this.message('手机号错误')
      } else if (!this.form.mobileCode) {
        this.message('验证码错误')
      } else if (!this.form.password) {
        this.message('密码格式错误')
      } else {
        this.btnLoading = true
        const password = crypto.AES.encrypt(this.form.password, '30886A121CEDEFDE3ED765311F89964C').toString()
        this.$API
          .missPass({
            mobile: this.form.mobile,
            mobileCode: this.form.mobileCode,
            userId: this.form.userId,
            password,
          })
          .then(res => {
            this.btnLoading = false
            Taro.navigateTo({ url: '/pages/bind-account/index' })
          })
          .catch(err => {
            this.btnLoading = false
            this.message(err.msg)
          })
      }
    },
  },
}
</script>
