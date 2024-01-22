<template>
  <view class="bind-account">
    <view class="form-item-wrapper">
      <radio-group @change="onChange">
        <label class="order-pay-item" v-for="(item, index) in accountTypes" :key="index">
          <radio :value="item.userType" :checked="item.userType === userType" color="#fa4a2d" />
          <text class="a">{{ item.label }}</text>
        </label>
      </radio-group>
    </view>
    <view class="account-item">
      <image :src="pwdIcon" mode="" />
      <input v-model="customerCode" placeholder-style="color:#a89e9e" placeholder="账户" />
    </view>
    <view class="account-item">
      <image :src="accountIcon" mode="" />
      <input v-model="customerPassword" type="password" placeholder-style="color:#a89e9e" placeholder="密码" />
    </view>
    <view class="footer">
      <nan-button type="primary" @tap="bindAccount">确定</nan-button>
    </view>
    <view class="footer-tip" @tap="forgetPassword"> 忘记密码？点击找回</view>
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
import accountIcon from '@/images/user/account.png'
import pwdIcon from '@/images/user/pwd.png'
import './index.less'
import ToastMixin from '@/mixin/toast'

export default {
  name: 'user',
  components: {},
  mixins: [ToastMixin],
  data() {
    return {
      accountIcon,
      pwdIcon,
      customerCode: '',
      customerPassword: '',
      userType: '1',
      accountTypes: [
        {
          label: '店长',
          userType: '1',
        },
        {
          label: '店员',
          userType: '2',
        },
      ],
      unionId: '',
    }
  },
  mounted() {
    setTitle({ title: '登录' })
    try {
      const unionId = Taro.getStorageSync('unionId')
      this.unionId = unionId
    } catch (e) {}
  },
  methods: {
    onChange(e) {
      this.userType = e.detail.value
    },
    bindAccount() {
      if (!this.customerCode || !this.customerPassword) {
        return Taro.showToast({
          title: '请将内容填写完整',
          icon: 'none',
        })
      }

      const password = crypto.AES.encrypt(this.customerPassword, '30886A121CEDEFDE3ED765311F89964C').toString()
      this.$API
        .bindShop({
          unionId: this.unionId,
          customerCode: this.customerCode,
          password,
          userType: this.userType,
        })
        .then(data => {
          if (data) {
            this.$store.commit('setUserInfo', data)
            Taro.setStorageSync('token', data.token)
            Taro.navigateBack({ delta: 1 })
          }
        })
        .catch(err => {
          this.showToast(err)
        })
    },
    accountTypeChange(e) {
      this.userType = this.accountTypes[e.detail.value].userType
    },
    forgetPassword() {
      Taro.navigateTo({ url: '/pages/bind-account/forget' })
    },
  },
}
</script>
