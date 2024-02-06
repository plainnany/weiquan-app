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
      <input v-model="customerCode" placeholder-style="color:#a89e9e" placeholder="账户" @blur="blur" @focus="focus" />
      <view class="account-history" v-if="showHistorySearch">
        <view class="account-history-item" v-for="(item, index) in historyList" :key="item" @tap="() => checkHistory(item)">
          <text>{{ item }}</text>
          <image :src="closeIcon" @tap="() => clearHistory(index)" />
        </view>
      </view>
    </view>
    <view class="account-item">
      <image :src="accountIcon" mode="" />
      <input v-model="customerPassword" type="password" placeholder-style="color:#a89e9e" placeholder="密码" />
    </view>
    <view class="privacy">
      <checkbox :checked="agree" @tap="() => (agree = !agree)"
        >我已阅读并同意
        <!-- <text @tap="jump(1)">《用户协议》</text> -->
        <text @tap="jump(2)">《隐私政策》</text></checkbox
      >
    </view>
    <view class="footer">
      <nan-button type="primary" @tap="bindAccount">确定</nan-button>
    </view>
    <view class="footer-tip" @tap="forgetPassword"> 忘记密码？点击找回</view>
    <view class="common-toast" v-show="errorToast.visible && errorToast.message">
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
import closeIcon from '@/images/delete2.png'
import { BASE_URL } from '@/const'

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
      closeIcon,
      historyList: [],
      showHistory: false,
      agree: false,
    }
  },
  computed: {
    showHistorySearch() {
      return this.historyList.length > 0 && this.showHistory
    },
  },
  mounted() {
    setTitle({ title: '登录' })
    const historyList = Taro.getStorageSync('accountHistory')
    if (historyList && historyList.length) {
      this.historyList = historyList
    }
    try {
      const unionId = Taro.getStorageSync('unionId')
      this.unionId = unionId
    } catch (e) {}
  },
  methods: {
    focus() {
      this.showHistory = true
    },
    blur() {
      setTimeout(() => {
        this.showHistory = false
      }, 50)
    },
    checkHistory(v) {
      this.customerCode = v
    },
    clearHistory(index) {
      this.historyList.splice(index, 1)
      Taro.setStorageSync('accountHistory', this.historyList)
    },
    onChange(e) {
      this.userType = e.detail.value
    },
    bindAccount() {
      if (!this.customerCode) {
        return this.showToast({ msg: '账号不能为空' })
      }
      if (!this.customerPassword) {
        return this.showToast({ msg: '请输入密码' })
      }
      if (!this.agree) {
        return this.showToast({ msg: '请同意用户协议' })
      }

      const password = crypto.AES.encrypt(this.customerPassword, '30886A121CEDEFDE3ED765311F89964C').toString()
      this.$API
        .bindShop({
          unionId: Taro.getStorageSync('unionId'),
          customerCode: this.customerCode,
          password,
          userType: this.userType,
        })
        .then(data => {
          if (data) {
            this.$store.commit('setUserInfo', data)
            Taro.setStorageSync('token', data.token)
            if (!this.historyList.includes(this.customerCode)) {
              this.historyList.push(this.customerCode)
              Taro.setStorageSync('accountHistory', this.historyList)
            }

            // 登录成功固定跳转到首页
            Taro.switchTab({ url: '/pages/index/index' })
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
    jump() {
      Taro.navigateTo({ url: `/pages/web-view/index?url=${BASE_URL}/xcxys.html` })
    },
  },
}
</script>
