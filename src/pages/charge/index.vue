<template>
  <view class="charge-page">
    <view class="charge-info">
      <text>
        可用余额(元)
      </text>
      <view class="charge-money">
        <view class="charge-num">
          <text>¥</text>
          <text>12333</text>
        </view>
        <text class="charge-btn">充值</text>
      </view>
    </view>
    <view class="charge-number charge-card">
      <view>充值金额</view>
      <view class="charge-input">
        <text>¥</text>
        <input placeholder="请输入充值金额" v-model="chargeNumber" />
      </view>
    </view>
    <view class="charge-number charge-card">
      <view>支付方式</view>
      <view class="charge-method">
        <view>
          <image :src="wechatIcon" mode="" />
          <text>微信支付</text>
        </view>
      </view>
    </view>
    <view class="charge-confirm">
      <button @tap="handleCharge">确认充值</button>
    </view>
  </view>
</template>

<script>
import './index.less'
import wechatIcon from '@/images/wechat.png'

export default {
  name: 'cost',
  components: {},
  data() {
    return {
      chargeNumber: '',
      wechatIcon,
    }
  },
  methods: {
    handleCharge() {
      console.log('start  charge')
    },
  },
}
</script>
