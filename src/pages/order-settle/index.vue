<template>
  <view class="order-settle">
    <view class="common-card">
      <view class="order-settle-item flex-between-center">
        <view class="order-settle-color-grey">订单编号</view>
        <view>{{ order.orderNumber }}</view>
      </view>
      <view class="order-settle-item flex-between-center">
        <view class="order-settle-color-grey">实付金额</view>
        <view class="order-settle-price"
          >¥ <text>{{ order.price }}</text></view
        >
      </view>
    </view>
    <view class="common-card order-settle-pay">
      <view class="order-settle-pay-title">支付方式</view>
      <radio-group @change="onPaymethodChange">
        <label class="order-settle-item flex-between-center" v-for="payItem in payList" :key="payItem.name">
          <view class="flex-between-center">
            <view>
              <image :src="payItem.icon" mode="" />
            </view>
            <view>
              {{ payItem.name }}
              <text v-if="payItem.method === 'weixin-pocket'"> (¥{{ '123' }}) </text>
            </view>
          </view>
          <view>
            <radio :value="payItem.method" color="#fa4a2d" />
          </view>
        </label>
      </radio-group>
    </view>
    <view class="order-settle-footer">
      <nan-button type="primary">确认支付</nan-button>
    </view>
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'
import wechatIcon from '@/images/wechat.png'
import alipayIcon from '@/images/alipay.png'
import weipocketIcon from '@/images/wei-pocket.png'

export default {
  name: 'cost',
  components: {},
  data() {
    return {
      order: {
        orderNumber: '111111111111111111111111',
        id: 1,
        imageUrl: '',
        price: '12.8',
        number: '78',
        specifications: '950g',
        title: '400ml 乳酸菌原味瓶装',
        unit: '1箱',
        type: '正常单',
        date: '2022-2-22',
      },
      alipayIcon,
      wechatIcon,
      payList: [
        {
          method: 'weixin-pocket',
          name: '余额支付',
          icon: weipocketIcon,
        },
        {
          name: '支付宝',
          method: 'alipay',
          icon: alipayIcon,
        },
        {
          method: 'weixin',
          name: '微信支付',
          icon: wechatIcon,
        },
        {
          method: 'weixin-by',
          name: '微信好友代付',
          icon: wechatIcon,
        },
        {
          name: '支付宝好友代付',
          method: 'alipay-by',
          icon: alipayIcon,
        },
      ],
    }
  },
  mounted() {
    setTitle({ title: '订单结算' })
  },
  methods: {
    onPaymethodChange(e) {
      console.log(e, e.detail.value)
    },
  },
}
</script>
