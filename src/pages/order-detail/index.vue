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
            <view>北京市海淀区恒大新宏福苑西区20号楼2单元301</view>
            <view>金金 15800000000</view>
          </view>
        </view>
        <view class="order-detail-nav">
          <image :src="backIcon" mode="" />
        </view>
      </view>
      <view class="common-card">
        <view>交货时间：2022-2-2</view>
        <view class="order-detail-item flex-between-center">
          <view class="flex-between-center">
            <view class="order-detail-image">
              <image :src="product.imageUrl" mode="" />
            </view>
            <view class="order-detail-info">
              <view>{{ product.title }}</view>
              <view>{{ product.specifications }} {{ product.unit }}</view>
              <view class="order-detail-tag"
                ><text>{{ product.type }}</text></view
              >
            </view>
          </view>
          <view>
            <view class="order-detail-price"
              >¥ <text>{{ product.price }}</text></view
            >
            <view>订单量 {{ product.number }}</view>
          </view>
        </view>
      </view>
      <view class="common-card">
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
      </view>
      <view class="common-card">
        <view class="flex-between-center order-detail-item">
          <text class="order-detail-color-grey">下单时间</text>
          <text>2021.12.27 12:22:35 </text>
        </view>
        <view class="flex-between-center order-detail-item">
          <text class="order-detail-color-grey">订单编号</text>
          <text>8283894949838</text>
        </view>
        <view class="flex-between-center order-detail-item">
          <text class="order-detail-color-grey">付款方式</text>
          <text>支付宝</text>
        </view>
        <view class="flex-between-center order-detail-item">
          <text class="order-detail-color-grey">交易流水号</text>
          <text>183772889499495885993884</text>
        </view>
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

export default {
  components: {},
  data() {
    return {
      locationIcon,
      backIcon,
      product: {
        id: 1,
        imageUrl: '',
        price: '12.8',
        number: '78',
        specifications: '950g',
        title: '400ml 乳酸菌原味瓶装',
        unit: '1箱',
        type: '正常单',
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
