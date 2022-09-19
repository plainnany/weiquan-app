<template>
  <view class="order-page">
    <view class="order-tabs">
      <view class="order-tab" :class="{ active: activeTab === tab.key }" v-for="tab in tabs" :key="tab.key" @tap="clickTab(tab)">{{
        tab.title
      }}</view>
    </view>
    <view class="order-result">
      <view class="order-result-empty" v-if="!orderList.length && hasGetOrder">
        <image :src="orderEmptyIcon" mode="" />
        <view class="order-result-empty-text">
          抱歉，没有找到订单哦
        </view>
      </view>
      <scroll-view :scroll-y="true" @scrolltolower="toLower" v-else>
        <view class="order-result-list">
          <view class="common-card" v-for="(order, index) in orderList" :key="index">
            <view class="order-result-title">
              <text>订单号 {{ order.orderNumber }}</text>
              <text class="order-result-type">{{ STATE_TYPE[order.state] }}</text>
            </view>
            <view class="order-result-content">
              <view>交货时间 {{ order.orderDate }}</view>
              <!-- <view class="order-result-deliver flex-between-center" @tap="viewDeliver(order)">
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
              </view> -->
              <view class="order-result-item flex-between-center" v-for="(product, pIndex) in order.orderListViews" :key="pIndex">
                <view class="flex-between-center">
                  <view class="order-result-image">
                    <image :src="product.productImage" mode="" />
                  </view>
                  <view class="order-result-info">
                    <view>{{ product.productName }}</view>
                    <view>{{ product.specifications }} {{ product.unit }}</view>
                    <view class="order-result-tag"
                      ><text>{{ ORDER_TYPE[product.orderType] }}</text></view
                    >
                  </view>
                </view>
                <view>
                  <view class="order-result-price"
                    >¥ <text>{{ product.price }}</text></view
                  >
                  <view>订单量 {{ product.productSum }}</view>
                </view>
              </view>
              <view class="flex-between-center">
                <text>共{{ order.orderListViews.length }}件商品</text>
                <!-- 待支付 -->
                <view class="flex-between-center" v-if="order.state === '01'">
                  <nan-button type="plain" @tap="cancelOrder(order)">取消订单</nan-button>
                  <nan-button type="primary" @tap="handlePay(order)">去支付</nan-button>
                </view>
                <!-- 已付款 -->
                <view class="flex-between-center" v-if="order.state === '02'">
                  <nan-button type="plain">取消订单</nan-button>
                  <nan-button type="primary">提醒发货</nan-button>
                </view>
                <!-- 待发货 -->
                <view class="flex-between-center" v-if="order.state === '03'">
                  <nan-button type="plain">取消订单</nan-button>
                  <nan-button type="primary">提醒发货</nan-button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'
import orderEmptyIcon from '@/images/order-empty.png'
import carIcon from '@/images/car.png'
import backIcon from '@/images/user/back.png'
import Taro from '@tarojs/taro'

export default {
  components: {},
  data() {
    return {
      activeTab: 'all',
      tabs: [
        {
          title: '全部',
          key: 'all',
          method: 'getAllOrder',
        },
        {
          title: '待付款',
          key: 'to-pay',
          method: 'getPendingPayment',
        },
        {
          title: '当天收货',
          key: 'to-deliver',
          method: 'getWaitDelivery',
        },
        // {
        //   title: '待收货',
        //   key: 'to-receive',
        // },
        {
          title: '已完成',
          key: 'done',
          method: 'getAlreadyCompleted',
        },
      ],
      orderList: [],
      orderEmptyIcon,
      carIcon,
      backIcon,
      ORDER_TYPE: {
        '01': '正常单',
        '02': '样品单',
        '03': '搭赠单',
      },
      // "state":"01待付款;02,03,04:待发货05:已完成",
      //
      STATE_TYPE: {
        '01': '待付款',
        '02': '待发货',
        '03': '待发货',
        '04': '待发货',
        '05': '已完成',
      },

      pageNo: 1,
      complete: false,
      loading: false,
      hasGetOrder: false,
    }
  },
  created() {
    this.$instance = Taro.getCurrentInstance()
  },
  mounted() {
    setTitle({ title: '我的订单' })
    const params = this.$instance.router.params
    const { type } = params
    if (type) {
      this.activeTab = type
    }
    this.getOrder({ type: 'all' })
  },
  methods: {
    clickTab({ key }) {
      this.activeTab = key
      this.pageNo = 1
      this.complete = false
      this.getOrder()
    },
    getOrder(isLoadMore) {
      const method = this.tabs.find(tab => tab.key === this.activeTab).method
      this.loading = true
      this.$API[method]({
        pageNo: this.pageNo,
        limit: 10,
      })
        .then(data => {
          data = data || []
          if (isLoadMore) {
            this.orderList = this.orderList.concat(data)
          } else {
            this.orderList = data
          }

          if (data.length === 0) {
            this.complete = true
          }
        })
        .finally(() => {
          this.loading = false
          this.hasGetOrder = true
        })
    },
    viewDeliver() {},
    toLower() {
      if (this.loading || this.complete) {
        return
      }
      this.pageNo++
      this.getOrder(true)
    },
    cancelOrder(order) {
      this.$API
        .deleteOrder({
          mainOrderNumber: order.orderNumber,
        })
        .then(data => {
          const index = this.orderList.findIndex(v => v.orderNumber === order.orderNumber)
          if (index > -1) {
            this.orderList.splice(index, 1)
          }
        })
    },
    handlePay(order) {
      const money = order.orderListViews.reduce((prev, cur) => prev + parseFloat(cur.price) * parseInt(cur.productSum), 0)
      Taro.navigateTo({ url: `/pages/order-settle/index?number=${order.orderNumber}&money=${money}` })
    },
  },
}
</script>
