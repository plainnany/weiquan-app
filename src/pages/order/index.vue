<template>
  <view class="order-page">
    <view class="order-tabs">
      <view class="order-tab" :class="{ active: activeTab === tab.key }" v-for="tab in tabs" :key="tab.key" @tap="clickTab(tab)">{{
        tab.title
      }}</view>
    </view>
    <view class="order-result">
      <view class="order-result-empty" v-if="!orderList.length">
        <image :src="orderEmptyIcon" mode="" />
        <view class="order-result-empty-text">
          抱歉，没有找到订单哦
        </view>
      </view>
      <view class="order-result-list" v-else>
        <view class="common-card" v-for="(order, index) in orderList" :key="index">
          <view class="order-result-title">
            <text>订单号 {{ order.orderNumber }}</text>
            <text class="order-result-type">{{ ORDER_TYPE[order.type] }}</text>
          </view>
          <view class="order-result-content">
            <view>交货时间 {{ order.date }}</view>
            <view class="order-result-deliver flex-between-center" @tap="viewDeliver(order)">
              <view class="flex-between-center">
                <image :src="carIcon" mode="" />
                <view class="order-result-deliver-info">
                  <view>[北京市] [北京综合邮件处理中心]，下一站，下一站，下一站</view>
                  <view>2021.12.28 10:31:11</view>
                </view>
              </view>
              <view>
                <image :src="backIcon" mode="" />
              </view>
            </view>
            <view class="order-result-item flex-between-center" v-for="product in order.productList" :key="product.id">
              <view class="flex-between-center">
                <view class="order-result-image">
                  <image :src="product.imageUrl" mode="" />
                </view>
                <view class="order-result-info">
                  <view>{{ product.title }}</view>
                  <view>{{ product.specifications }} {{ product.unit }}</view>
                  <view class="order-result-tag"
                    ><text>{{ product.type }}</text></view
                  >
                </view>
              </view>
              <view>
                <view class="order-result-price"
                  >¥ <text>{{ product.price }}</text></view
                >
                <view>订单量 {{ product.number }}</view>
              </view>
            </view>
            <view class="flex-between-center">
              <text>共1件商品</text>
              <view class="flex-between-center">
                <nan-button type="plain">取消订单</nan-button>
                <nan-button type="primary">去支付</nan-button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'
import orderEmptyIcon from '@/images/order-empty.png'
import carIcon from '@/images/car.png'
import backIcon from '@/images/user/back.png'

export default {
  components: {},
  data() {
    return {
      activeTab: 'all',
      tabs: [
        {
          title: '全部',
          key: 'all',
        },
        {
          title: '待付款',
          key: 'to-page',
        },
        {
          title: '待发货',
          key: 'to-deliver',
        },
        {
          title: '待收货',
          key: 'to-receive',
        },
        {
          title: '待评价',
          key: 'to-comment',
        },
      ],
      orderList: [],
      orderEmptyIcon,
      carIcon,
      backIcon,
      ORDER_TYPE: {
        'to-pay': '待付款',
        'to-deliver': '待发货',
      },
    }
  },
  mounted() {
    setTitle({ title: '我的订单' })
    this.getOrder({ type: 'all' })
  },
  methods: {
    clickTab({ key }) {
      this.activeTab = key
    },
    getOrder({ type }) {
      this.$API.getOrder().then(res => {
        this.orderList = res.data
      })
    },
    viewDeliver() {},
  },
}
</script>
