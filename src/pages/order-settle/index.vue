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
    <view class="order-settle-pay">
      <view class="order-settle-pay-title">支付选择</view>
      <pay-method
        :showTipModal="showTipModal"
        :initPayMethod="initPayMethod"
        @change="onPayMethodChange"
        @cancel="cancelModal"
        @confirm="confirmPay"
      />
      <view class="tips"
        >注:选择好友代付后，请于15分钟内支付。若支付不成功或超时支付，请前往‘账户余额及充值’查询退款记录，或联系客服查询。感谢!</view
      >
    </view>
    <view class="order-settle-footer">
      <nan-button type="primary" @tap="handleConfirm">立即支付</nan-button>
    </view>
    <view class="common-toast" v-show="errorToast.visible && errorToast.message">
      <text>{{ errorToast.message }}</text></view
    >
    <Modal
      :visible="modal.visible"
      v-if="modal.visible"
      :title="modal.title"
      cancelText="取消"
      confirmText="去充值"
      @cancel="() => (modal = {})"
      @confirm="goCharge"
    >
      <view style="padding: 0 24rpx; font-size: 30rpx">{{ modal.content }}</view>
    </Modal>
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'
import wechatIcon from '@/images/wechat.png'
import alipayIcon from '@/images/alipay.png'
import weipocketIcon from '@/images/wei-pocket.png'
import Taro from '@tarojs/taro'
import ToastMixin from '@/mixin/toast'
import Modal from '../setting/modal.vue'

export default {
  name: 'order-settle',
  components: { Modal },
  mixins: [ToastMixin],
  data() {
    return {
      orderNumber: '',
      totalFee: '',
      alipayIcon,
      wechatIcon,
      // payMethod: 'weixin-pocket',
      payMethod: '',
      initPayMethod: '',
      showTipModal: false,
      modal: {
        visible: false,
        content: '',
        title: '',
      }, // 余额不足提示
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
    this.initPayMethod = this.initPay()
    this.payMethod = this.initPayMethod
  },
  onShareAppMessage(res) {
    // 调用此方法时，会重新触发onShow，以及。app.js中的onShow,暂时只处理当前页面中的onShow方法
    this.notTrigger = true
    return {
      title: '老板，订货请支付！',
      path: `/pages/web-view/index?url=${encodeURIComponent(this.wechatUrl)}`,
      imageUrl: 'http://foodservice-main.oss-cn-hangzhou.aliyuncs.com/kd/fx.png',
      // promise,
    }
  },
  onShow() {
    if (this.notTrigger) return
    const params = Taro.getCurrentInstance().router.params
    this.orderNumber = params.number
    this.totalFee = Number(params.money).toFixed(2)
    this.productId = params.productId
    this.wechatUrl = decodeURIComponent(params.payUrl)
    this.tradeNumber = params.trade
  },
  methods: {
    initPay() {
      if (this.userInfo.accountType === '02' || !this.userInfo.dianZhang) {
        return 'weixin-2'
      }
      // 存在活动金额时优先选中活动余额，否则选择余额支付
      if (this.userInfo.activityFlg === '01') {
        return 'activity-pocket'
      }
      return 'weixin-pocket'
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
      if (this.payMethod === 'weixin-pocket' || this.payMethod === 'company-pocket' || this.payMethod === 'activity-pocket') {
        const method = {
          'weixin-pocket': 'balancePayment',
          'company-pocket': 'balanceParentPayment',
          'activity-pocket': 'activityBalancePayment',
        }[this.payMethod]
        this.$API[method]({
          out_trade_no: this.tradeNumber,
          orderNumber: this.orderNumber,
        })
          .then(() => {
            Taro.redirectTo({
              url: `/pages/pay-countdown/result?orderNumber=${this.orderNumber}&productId=${this.productId}`,
            })
          })
          .catch(err => {
            if (err.returnCode === 333) {
              this.modal = {
                visible: true,
                content: '余额不足是否充值？',
                title: '提示',
              }
            } else {
              this.showToast(err)
            }
          })
      } else if (this.payMethod === 'weixin') {
        // 如果是微信支付，SurplusPage=01 跳转中间支付倒计时页面，然后拉起微信小程序支付
        const unionId = Taro.getStorageSync('unionId')
        // 否则，直接拉起微信小程序支付
        this.$API
          .unifiedorder({
            _data: JSON.stringify({
              out_trade_no: this.tradeNumber,
              total_fee: this.totalFee,
            }),
            openid: unionId,
          })
          .then(data => {
            if (data.surplusPage === '01') {
              Taro.navigateTo({
                url: `/pages/pay-countdown/index?orderNumber=${this.orderNumber}&tradeNumber=${this.tradeNumber}&productId=${this.productId}&from=detail`,
              })
            } else {
              wx.requestPayment({
                ...data,
                appId: data.appid,
                package: data.packageStr,
                success: res => {
                  Taro.redirectTo({ url: '/pages/order/index?type=all' })
                },
                fail: err => {
                  this.showToast(err)
                },
                complete: function(res) {},
              })
            }
          })
          .catch(err => {
            this.showToast(err)
          })
      }
    },
    goCharge() {
      this.modal = {}
      Taro.navigateTo({ url: '/pages/charge/index' })
    },
  },
}
</script>
