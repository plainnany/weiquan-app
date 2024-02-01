<template>
  <!-- 支付倒计时页面 -->
  <view class="pay-countdown">
    <view class="pay-countdown-item">
      <view class="pay-countdown-title">
        <image :src="shopIcon" />
        <text class="label">来自</text>
      </view>
      <view class="pay-countdown-content">味全食品</view>
    </view>
    <view class="pay-countdown-item">
      <view class="pay-countdown-title">
        <image :src="moneyIcon" />
        <text class="label">金额</text>
      </view>
      <view class="pay-countdown-content">{{ total_fee }}</view>
    </view>
    <view class="pay-countdown-tip">
      <view class="info">支付订单失效时间</view>
      <view class="time">{{ countDown }}</view>
    </view>
    <view class="pay-countdown-footer">
      <nan-button class="confirm" :loading="btnLoading" @tap="confirm">确认支付</nan-button>
      <nan-button class="back" @tap="goBack">返回商户界面</nan-button>
    </view>
    <view class="common-toast" v-show="errorToast.visible && errorToast.message">
      <text>{{ errorToast.message }}</text></view
    >
  </view>
</template>

<script>
import './index.less'
import moneyIcon from './images/jb.png'
import shopIcon from './images/dp.png'
import { setTitle } from '@/utils'
import Taro from '@tarojs/taro'
import ToastMixin from '@/mixin/toast'

export default {
  components: {},
  mixins: [ToastMixin],
  data() {
    return {
      moneyIcon,
      shopIcon,
      countDown: '',
      orderNumber: '',
      detailData: {},
      total_fee: '',
      btnLoading: false,
    }
  },
  computed: {},
  mounted() {
    setTitle({ title: '微信支付' })
    const { orderNumber, tradeNumber, productId, from } = Taro.getCurrentInstance().router.params
    this.orderNumber = orderNumber
    this.tradeNumber = tradeNumber
    this.productId = productId
    this.from = from
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.$API
        .payCountdown({
          orderNumber: this.orderNumber,
        })
        .then(data => {
          this.detailData = data
          this.total_fee = data.payInfo?.total_fee
          this.handleCountDown()
        })
        .catch(err => this.showToast(err))
    },
    handleCountDown() {
      if (!this.detailData.surplus || this.detailData.surplus <= 0) return
      const timeDifference = this.detailData.surplus

      const minutes = Math.floor(timeDifference / 60)
      const seconds = Math.floor(timeDifference % 60)
      this.minutes = Number(minutes)
      this.seconds = Number(seconds)
      if (this.minutes && this.seconds) {
        this.seconds -= 1
        if (this.seconds === 0) {
          this.minutes -= 1
        }
        if (this.minutes === 0 && this.seconds === 0) {
          return
        }
        this.countDown = `${this.minutes}:${this.seconds <= 9 ? '0' + this.seconds : this.seconds}`
        this.setCountDown()
      }
    },
    setCountDown() {
      this.timer = setTimeout(() => {
        if (this.seconds === 0) {
          this.seconds = 60
          this.minutes -= 1
        }
        this.seconds -= 1

        if (this.minutes === 0 && this.seconds === 0) {
          clearTimeout(this.timer)
          this.countDown = ''
          this.goBack()
        } else {
          this.countDown = `${this.minutes}:${this.seconds <= 9 ? '0' + this.seconds : this.seconds}`
          this.setCountDown()
        }
      }, 1000)
    },
    confirm() {
      this.btnLoading = true
      const unionId = Taro.getStorageSync('unionId')
      this.$API
        .unifiedorder({
          _data: JSON.stringify({
            out_trade_no: this.tradeNumber,
            total_fee: this.total_fee,
            subject: 'test',
          }),
          payType: '01',
          openid: unionId,
        })
        .then(data => {
          this.btnLoading = false

          // 调用微信支付接口
          wx.requestPayment({
            ...data,
            appId: data.appid,
            package: data.packageStr,
            success: res => {
              if (this.from === 'charge') {
                Taro.redirectTo({ url: `/pages/cost/detail` })
              } else if (this.from === 'detail') {
                Taro.reLaunch({ url: `/pages/pay-countdown/result?orderNumber=${this.orderNumber}&productId=${this.productId}` })
              } else if (this.from === 'h5') {
                const url = encodeURIComponent(`https://wsorder.weichuan.com.cn/paySuccess.htm?out_trade_no=${this.tradeNumber}`)
                Taro.redirectTo({
                  url: `/pages/web-view/index?url=${url}`,
                })
              } else {
                Taro.redirectTo({ url: `/pages/order/index?type=to-pay` })
              }
            },
            fail: err => {
              this.showToast(err)
            },
            complete: function(res) {},
          })
          // // 招商支付的appId，后端不知道怎么获取，前端暂时写死了
          // Taro.navigateToMiniProgram({
          //   appId: 'wx88297831a71c80e3',
          //   path: data.appletsPayUrl,
          // })
        })
        .catch(err => {
          this.btnLoading = false
          this.showToast(err)
        })
    },
    goBack() {
      Taro.navigateBack({ delta: 1 })
    },
  },
}
</script>
