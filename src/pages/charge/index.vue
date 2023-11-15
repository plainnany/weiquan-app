<template>
  <view class="charge-page">
    <view class="charge-way">请选择充值方式</view>
    <view class="charge-card">
      <view class="charge-method">
        <view>
          <image :src="wechatIcon" mode="" />
          <text>微信支付</text>
        </view>
      </view>
    </view>
    <view class="charge-number charge-card">
      <view>金额</view>
      <view class="charge-input">
        <input type="number" placeholder="请输入充值金额" v-model="chargeNumber" />
      </view>
    </view>
    <view class="charge-confirm">
      <button @tap="handleCharge" :loading="btnLoading">确认充值</button>
    </view>
  </view>
</template>

<script>
import './index.less'
import wechatIcon from '@/images/wechat.png'
import Taro from '@tarojs/taro'

export default {
  name: 'cost',
  components: {},
  data() {
    return {
      chargeNumber: '',
      wechatIcon,
      balance: '',
      btnLoading: false,
    }
  },
  mounted() {
    this.$API.getBillCost().then(data => {
      this.balance = data
    })
  },
  methods: {
    handleCharge() {
      if (!this.chargeNumber) {
        return Taro.showToast({
          title: '请输入充值金额',
          icon: 'error',
        })
      }
      if (!/\d+/.test(this.chargeNumber)) {
        return Taro.showToast({
          title: '请输入正确金额',
          icon: 'error',
        })
      }
      this.btnLoading = true
      this.$API
        .recharge({
          money: this.chargeNumber,
        })
        .then(data => {
          if (data && data.wechatUrl) {
            Taro.navigateTo({
              url: `/pages/web-view/index?url=${data.wechatUrl}`,
            })
          }
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
  },
}
</script>
