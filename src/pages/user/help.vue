<template>
  <view class="help-page">
    <view class="wrapper">
      <view class="phone" @tap="contact">
        <image :src="phoneIcon" mode="" />
        客服</view
      >
      <view class="tab" @tap="toggle" :class="{ expand: expand }">
        常见问题
      </view>
      <view class="help-content" v-if="expand">
        <view class="question">
          A 订单超时配送怎么办？
        </view>
        <view class="answer"> 亲爱的客户您好，我们的物流正在加急为您配送中，如有延迟，请您耐心等待，给您带来不便，我们深感抱歉。</view>
        <view class="question">
          B 配送时间/地址/电话错了，怎么修改？密码错了，怎么修改？
        </view>
        <view class="answer"> 亲爱的客户，目前不支持修改订单信息，如你遇地址、电话、密码错误等问题在线处理，建议您联络业务代表处理。</view>
        <view class="question">
          C 下单时间过点怎么办？
        </view>
        <view class="answer"> 亲爱的客户，目前不支持过点下单，如过点可下单在下个周期，如有特殊需求，烦请联络业务代表协助处理。</view>
        <view class="question">
          D 配送订单数量怎么改？
        </view>
        <view class="answer">
          亲爱的客户，目前不支持过点下单修改，可在下单时间点截止前修改订单数量，路径为：请您点击“APP”→“我的”→“修改订单”→“筛选日期”→“修改订单数量”→“完成修改”。</view
        >
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import phoneIcon from '@/images/phone.svg'
import './help.less'
import {setTitle} from '@/utils'

export default {
  data() {
    return {
      phoneIcon,
      expand: true,
    }
  },
  mounted() {
    setTitle({ title: '帮助中心' })
  },
  methods: {
    contact() {
      if (!this.$store.state.userInfo.customerService) {
        Taro.showToast({
          title: '用户未登录，请先登录',
          icon: 'none',
        })

        setTimeout(() => {
          Taro.navigateTo({ url: '/pages/bind-account/index' })
        }, 2000)
        return
      }
      Taro.makePhoneCall({
        phoneNumber: this.$store.state.userInfo.customerService,
      })
    },
    toggle() {
      this.expand = !this.expand
    },
  },
}
</script>
