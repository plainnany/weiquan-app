<template>
  <view class="order-settle">
    <view class="common-card">
      <view class="order-settle-item flex-between-center">
        <view class="order-settle-color-grey">订单编号</view>
        <view>{{ orderNumber }}</view>
      </view>
      <view class="order-settle-item flex-between-center">
        <view class="order-settle-color-grey">实付金额</view>
        <view class="order-settle-price" v-if="isDianZhang"
          >¥ <text>{{ totalFee }}</text></view
        >
        <view class="order-settle-price" v-else>****</view>
      </view>
    </view>
    <view class="common-card order-settle-pay">
      <view class="order-settle-pay-title">支付选择</view>
      <pay-method :showTipModal="showTipModal" @change="onPayMethodChange" @cancel="cancelModal" @confirm="confirmPay" />
      <view class="tips"
        >注:选择好友代付后，请于15分钟内支付。若支付不成功或超时支付，请前往“账户余额及充值查询退款记录，或联系客服查询。感谢!</view
      >
    </view>
    <view class="order-settle-footer">
      <nan-button type="primary" @tap="confirmPay">立即支付</nan-button>
    </view>
    <view class="common-toast" v-if="errorToast.visible && errorToast.message">
      <text>{{ errorToast.message }}</text></view
    >
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'
import wechatIcon from '@/images/wechat.png'
import alipayIcon from '@/images/alipay.png'
import weipocketIcon from '@/images/wei-pocket.png'
import Taro from '@tarojs/taro'

export default {
  name: 'cost',
  components: {},
  data() {
    return {
      orderNumber: '',
      totalFee: '',
      alipayIcon,
      wechatIcon,
      payMethod: 'weixin-pocket',
      showTipModal: false,
      errorToast: {
        visible: false,
        message: '',
      },
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    // 需要区分是否是店长店员，
    // 店员：只有微信好友支付，并且余额显示未***
    isDianZhang() {
      return this.userInfo.dianZhang
    },
    openType() {
      return this.payMethod === 'weixin-2' ? 'share' : ''
    },
  },
  mounted() {
    setTitle({ title: '订单结算' })
  },
  onShareAppMessage(res) {
    // 调用此方法时，会重新触发onShow，以及。app.js中的onShow,暂时只处理当前页面中的onShow方法
    this.notTrigger = true
    return {
      title: '老板，订货请支付！',
      path: `/pages/web-view/index?url=${this.wechatUrl}`,
      imageUrl: 'http://foodservice-main.oss-cn-hangzhou.aliyuncs.com/kd/fx.png',
      // promise,
    }
  },
  onShow() {
    if (this.notTrigger) return
    const params = Taro.getCurrentInstance().router.params
    this.orderNumber = params.number
    this.totalFee = params.money
    this.wechatUrl = params.payUrl
    this.tradeNumber = params.trade
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
    onPayMethodChange(e) {
      this.payMethod = e.detail.value
    },
    cancelModal() {
      this.showTipModal = false
    },
    handleConfirm() {
      if (this.payMethod === 'company-pocket') {
        this.showTipModal = true
      } else {
        this.confirmPay()
      }
    },
    confirmPay() {
      if (this.payMethod === 'weixin-pocket' || this.payMethod === 'company-pocket') {
        const method = {
          'weixin-pocket': 'balancePayment',
          'company-pocket': 'balanceParentPayment',
        }[this.payMethod]
        this.$API[method]({
          out_trade_no: this.tradeNumber,
          orderNumber: this.orderNumber,
        })
          .then(() => {
            Taro.navigateTo({
              url: `/pages/order-detail/index?order=${this.orderNumber}`,
            })
          })
          .catch(err => {
            this.showToast(err)
          })
      } else if (this.payMethod === 'weixin') {
        // 如果是微信支付，SurplusPage=01 跳转中间支付倒计时页面，然后拉起微信小程序支付
        // 否则，直接拉起微信小程序支付
        this.$API
          .unifiedorder({
            _data: JSON.stringify({
              out_trade_no: this.tradeNumber,
              total_fee: this.totalFee,
            }),
          })
          .then(data => {
            if (data.surplusPage === '01') {
              Taro.navigateTo({
                url: `/pages/pay-countdown/index?orderNumber=${this.orderNumber}&tradeNumber=${this.tradeNumber}`,
              })
            } else {
              Taro.navigateToMiniProgram({
                appId: data.appletsOriginalId,
                path: data.appletsPayUrl,
              })
            }
          })
          .catch(err => {
            this.showToast(err)
          })
      }
    },
  },
}
</script>
