<template>
  <view class="account-modify">
    <view class="form" v-if="key !== 'customerLinkTel'">
      <view class="label">{{ title }}: </view>
      <view class="content">
        <input v-model="innerValue" :placeholder="innerValue" />
      </view>
    </view>
    <view v-else class="link-tel">
      <view class="item">
        <input v-model="mobile" placeholder="请输入新手机号码" />
        <nan-button type="primary" @tap="sendCode">
          {{ sending ? countDown + 's' : '获取验证码' }}
        </nan-button>
      </view>
      <view class="item">
        <input v-model="mobileCode" placeholder="验证码" />
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
      mobile: '',
      mobileCode: '',
      countDown: 60,
      sending: false,
      innerValue: '',
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
    this.innerValue = this.userInfo[key] || ''
    if (key === 'customerLinkTel') {
      setTitle({ title: `重置手机号` })
    } else {
      setTitle({ title: `${title}修改` })
    }
  },
  methods: {
    handleConfirm(item) {
      if (this.key === 'customerLinkTel') {
        this.$API
          .mobileReset({
            mobile: this.mobile,
            mobileCode: this.mobileCode,
          })
          .then(() => {
            this.redirect()
          })
      } else {
        const method = {
          customerLinkMan: 'updateCustomerLinkMan', // 修改联系人
          consigneeLink: 'updateConsigneeLink', // 修改收货人
        }[this.key]

        const params = {
          [this.key]: this.innerValue,
        }
        if (!method) return
        this.$API[method](params).then(res => {
          Taro.showToast({
            title: '修改成功',
            icon: 'success',
          })

          this.redirect()
        })
      }
    },
    redirect() {
      this.$store.commit('setUserInfo', {
        ...this.userInfo,
        [this.key]: this.innerValue,
      })
      Taro.navigateTo({
        url: `/pages/account-manage/index`,
      })
    },
    sendCode() {
      if (this.sending) return
      this.sending = true
      this.$API
        .sendCode({
          smsType: 3,
          mobileTel: this.mobile,
        })
        .then(() => {
          this.sending = false
          this.timer = setInterval(() => {
            this.countDown--
            if (this.countDown <= 0) {
              this.sending = false
              clearInterval(this.timer)
            }
          }, 1000)
        })
    },
  },
}
</script>
