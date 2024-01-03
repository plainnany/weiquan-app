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
      <radio-group @change="onPaymethodChange">
        <label class="order-settle-item flex-between-center" v-for="payItem in payList" :key="payItem.name">
          <view class="flex-between-center">
            <view>
              <image :src="payItem.icon" mode="" />
            </view>
            <view>
              {{ payItem.name }}
              <text v-if="payItem.method === 'weixin-pocket'"> ({{ userInfo.accoutBalance }}) </text>
            </view>
          </view>
          <view>
            <radio :value="payItem.method" :checked="payItem.method === payMethod" color="#333" v-show="payItem.method === payMethod" />
          </view>
        </label>
      </radio-group>
      <view class="tips"
        >注:选择好友代付后，请于15分钟内支付。若支付不成功或超时支付，请前往“账户余额及充值查询退款记录，或联系客服查询。感谢!</view
      >
    </view>
    <view class="order-settle-footer">
      <nan-button type="primary" @tap="confirmPay">立即支付</nan-button>
    </view>
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
    }
  },
  computed: {
    payList() {
      if (this.userInfo.accountType === '02' || !this.isDianZhang) {
        this.payMethod = ''
        return [
          {
            method: 'weixin-2',
            name: '微信好友支付',
            icon: wechatIcon,
          },
        ]
      }
      return [
        {
          method: 'weixin-pocket',
          name: '余额支付',
          icon: weipocketIcon,
        },
        {
          method: 'company-pocket',
          name: '总部余额',
          icon: weipocketIcon,
        },
        {
          method: 'weixin',
          name: '微信支付',
          icon: wechatIcon,
        },
        {
          method: 'weixin-2',
          name: '微信好友代付',
          icon: wechatIcon,
        },
      ]
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    // 需要区分是否是店长店员，
    // 店员：只有微信好友支付，并且余额显示未***
    isDianZhang() {
      return this.userInfo.dianZhang
    },
  },
  mounted() {
    setTitle({ title: '订单结算' })
  },
  onShow() {
    const params = Taro.getCurrentInstance().router.params
    this.orderNumber = params.number
    this.totalFee = params.money
    this.wechatUrl = params.payUrl
    this.tradeNumber = params.trade
  },
  methods: {
    onPaymethodChange(e) {
      this.payMethod = e.detail.value
    },
    confirmPay() {
      if (this.payMethod === 'weixin-pocket' || this.payMethod === 'company-pocket') {
        const method = {
          'weixin-pocket': 'balancePayment',
          'company-pocket': 'balanceParentPayment',
        }
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
            Taro.showToast({
              title: err.msg,
              icon: 'error',
            })
          })
      } else if (this.payMethod === 'weixin') {
        // this.$API
        //   .unifiedorder({
        //     out_trade_no: this.tradeNumber,
        //     total_fee: this.totalFee,
        //   })
        //   .then(res => {
        //     debugger
        //     Taro.navigateBackMiniProgram({
        //       appId: '',
        //     })
        //   })
        //   .catch(err => {
        //     Taro.showToast({
        //       title: err.msg,
        //       icon: 'error',
        //     })
        //   })
        Taro.showToast({
          title: '正在升级招商微信支付中。',
          icon: 'error',
        })
        // Taro.navigateTo({
        //   url: `/pages/web-view/index?url=${this.wechatUrl}`,
        // })
      } else if (this.payMethod === 'weixin-2') {
        Taro.showToast({
          title: '正在升级招商微信支付中。',
          icon: 'error',
        })
      }
    },
  },
}
</script>
