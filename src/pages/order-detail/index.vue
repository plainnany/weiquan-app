<template>
  <view class="order-detail">
    <view class="order-detail-type">
      <view>待付款</view>
      <view>9分钟后订单关闭，请及时付款哦</view>
    </view>
    <view class="order-detail-content">
      <view class="common-card flex-between-center">
        <view class="flex-between-center">
          <view class="order-detail-location">
            <image :src="locationIcon" mode="" />
          </view>
          <view class="order-detail-location-info">
            <view>{{ userInfo.customerAddress }} </view>
            <view>{{ userInfo.customerLinkMan }} {{ userInfo.customerLinkTel }}</view>
          </view>
        </view>
        <view class="order-detail-nav">
          <image :src="backIcon" mode="" />
        </view>
      </view>
      <view v-for="(product, index) in orderDetail.list" :key="index">
        <view class="common-card">
          <view>交货时间：{{ product.orderDate }}</view>
          <view class="order-detail-item flex-between-center">
            <view class="flex-between-center">
              <view class="order-detail-image">
                <image :src="product.productImage" mode="" />
              </view>
              <view class="order-detail-info">
                <view>{{ product.productName }}</view>
                <view>{{ product.productSpecs }} {{ product.specifications }}</view>
                <view class="order-detail-tag"
                  ><text>{{ ORDER_TYPE[product.orderType] }}</text></view
                >
              </view>
            </view>
            <view>
              <view class="order-detail-price" v-if="product.price"
                >¥ <text>{{ product.price }}</text></view
              >
              <view>订单量 {{ product.productSum }}</view>
            </view>
          </view>
        </view>
        <!-- <view class="common-card">
          <view class="flex-between-center">
            <text class="order-detail-color-grey">商品小计</text>
            <view class="order-detail-sum"
              >¥ <text>{{ product.price }}</text></view
            >
          </view>
          <view class="flex-between-center">
            <text class="order-detail-color-grey">活动优惠</text>
            <view class="order-detail-sum"
              >-¥ <text>{{ '7' }}</text></view
            >
          </view>
          <view class="flex-between-center order-detail-total">
            <text>应付金额合计</text>
            <view class="order-detail-sum"
              >¥ <text>{{ '31.8' }}</text></view
            >
          </view>
        </view> -->
      </view>
      <view class="common-card">
        <view class="flex-between-center order-detail-item">
          <text class="order-detail-color-grey">下单时间</text>
          <text>{{ orderDetail.createDate }}</text>
        </view>
        <view class="flex-between-center order-detail-item">
          <text class="order-detail-color-grey">订单编号</text>
          <text>{{ orderDetail.customerOrderCode }}</text>
        </view>
        <!-- <view class="flex-between-center order-detail-item">
          <text class="order-detail-color-grey">付款方式</text>
          <text>支付宝</text>
        </view> -->
        <!-- <view class="flex-between-center order-detail-item">
          <text class="order-detail-color-grey">交易流水号</text>
          <text>183772889499495885993884</text>
        </view> -->
      </view>
    </view>
    <view class="order-detail-footer flex-between-center">
      <view></view>
      <view class="flex-between-center">
        <nan-button type="plain">取消订单</nan-button>
        <nan-button type="primary">去支付</nan-button>
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'
import locationIcon from '@/images/location.png'
import backIcon from '@/images/user/back.png'
import Taro from '@tarojs/taro'

export default {
  components: {},
  data() {
    return {
      locationIcon,
      backIcon,
      ORDER_TYPE: {
        '01': '正常单',
        '02': '样品单',
        '03': '搭赠单',
      },
      orderDetail: {
        list: [],
        //         createDate: "2022-09-19 20:36:56"
        // customerOrderCode: "2022091920365617123456789"
        // list: Array(4)
        // payDate: "2022-09-19 20:37:02"
        // state: "02"
      },
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  mounted() {
    setTitle({ title: '我的订单' })
  },
  onShow() {
    const { order } = Taro.getCurrentInstance().router.params
    this.getOrder(order)
  },
  methods: {
    clickTab({ key }) {
      this.activeTab = key
    },
    getOrder(orderNumber) {
      this.$API
        .getOrderDetail({
          orderNumber: '2022091920365617123456789',
        })
        .then(data => {
          this.orderDetail = data
          console.log(data)
        })
    },
    viewDeliver() {},
  },
}
</script>
