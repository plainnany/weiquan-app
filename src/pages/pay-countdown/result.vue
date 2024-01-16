<template>
  <!-- 支付结果页面 -->
  <view class="pay-result">
    <view class="pay-result-header">
      <view>
        <image :src="payIcon" mode="" />
      </view>
      <view>
        <view>恭喜您支付成功</view>
        <view class="fs-small">请核对详细地址</view>
      </view>
    </view>
    <view class="pay-result-content">
      <view class="pay-result-title">
        <text>{{ userInfo.customerLinkMan }}</text>
        <text>{{ userInfo.customerLinkTel }}</text>
      </view>
      <view class="fs-small">{{ userInfo.customerAddress }}</view>
    </view>
    <view class="pay-result-footer">
      <nan-button type="primary" @tap="goBack">查看订单详情</nan-button>
      <nan-button type="plain" @tap="goHome">返回首页</nan-button>
    </view>
  </view>
</template>

<script>
import './result.less'
import payIcon from './images/pay.png'
import { setTitle } from '@/utils'
import Taro from '@tarojs/taro'

export default {
  components: {},
  data() {
    return {
      payIcon,
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  mounted() {
    setTitle({ title: '订单结算' })
    const { orderNumber, productId } = Taro.getCurrentInstance().router.params
    this.orderNumber = orderNumber
    this.productId = productId === 'undefined' ? undefined : productId
  },
  methods: {
    goBack() {
      if (this.productId) {
        Taro.redirectTo({ url: `/pages/product-detail/index?id=${this.productId}` })
      } else {
        Taro.redirectTo({ url: `/pages/order/index?type=to-pay` })
      }
    },
    goHome() {
      Taro.reLaunch({ url: '/pages/index/index' })
    },
  },
}
</script>
