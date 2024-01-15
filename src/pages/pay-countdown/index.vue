<template>
  <!-- 支付倒计时页面 -->
  <view class="pay-countdown">
    <view class="pay-countdown-item">
      <view class="pay-countdown-title">
        <image :src="editIcon" />
        <text class="label">来自</text>
      </view>
      <view class="pay-countdown-content">味全食品</view>
    </view>
    <view class="pay-countdown-item">
      <view class="pay-countdown-title">
        <image :src="editIcon" />
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
    <view class="common-toast" v-if="errorToast.visible && errorToast.message">
      <text>{{ errorToast.message }}</text></view
    >
  </view>
</template>

<script>
import './index.less'
import editIcon from '@/images/edit.png'
import { setTitle } from '@/utils'
import Taro from '@tarojs/taro'

export default {
  components: {},
  data() {
    return {
      editIcon,
      countDown: '',
      orderNumber: '',
      errorToast: {
        visible: false,
        message: '',
      },
      detailData: {},
      total_fee: '',
      btnLoading: false,
    }
  },
  computed: {},
  mounted() {
    setTitle({ title: '微信支付' })
    const { orderNumber, tradeNumber } = Taro.getCurrentInstance().router.params
    this.orderNumber = orderNumber
    this.tradeNumber = tradeNumber
    this.getDetail()
  },
  methods: {
    showToast(err) {
      this.errorToast.visible = true
      this.errorToast.message = err.msg
      setTimeout(() => {
        this.errorToast = {
          visible: false,
          message: '',
        }
      }, 2000)
    },
    getDetail() {
      this.$API
        .payCountdown({
          orderNumber: this.orderNumber || '2024011421274471123456789',
        })
        .then(data => {
          this.detailData = data
          this.total_fee = data.payInfo?.total_fee
          this.handleCountDown()
          // this.countdown = data
        })
        .catch(err => this.showToast(err))
    },
    handleCountDown() {
      if (!this.detailData.surplus) return
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
      this.$API
        .unifiedorder({
          _data: JSON.stringify({
            out_trade_no: this.tradeNumber,
            total_fee: this.total_fee,
            subject: 'test',
          }),
          payType: '01',
        })
        .then(data => {
          this.btnLoading = false
          // 招商支付的appId，后端不知道怎么获取，前端暂时写死了
          Taro.navigateToMiniProgram({
            appId: 'wx88297831a71c80e3',
            path: data.appletsPayUrl,
          })
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
