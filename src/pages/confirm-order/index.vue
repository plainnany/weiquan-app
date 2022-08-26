<template>
  <view class="confirm-order">
    <view class="common-card flex-between-center">
      <view class="flex-between-center">
        <view class="confirm-order-location">
          <image :src="locationIcon" mode="" />
        </view>
        <view class="confirm-order-location-info">
          <view>北京市海淀区恒大新宏福苑西区20号楼2单元301</view>
          <view>金金 15800000000</view>
        </view>
      </view>
      <view class="confirm-order-nav">
        <image :src="backIcon" mode="" />
      </view>
    </view>
    <view class="common-card flex-between-center">
      <view style="color: #666">{{ product.date }}</view>
      <view class="confirm-order-nav">
        <image :src="backIcon" mode="" />
      </view>
    </view>
    <view class="common-card">
      <view class="confirm-order-item flex-between-center">
        <view class="flex-between-center">
          <view class="confirm-order-image">
            <image :src="product.imageUrl" mode="" />
          </view>
          <view class="confirm-order-info">
            <view>{{ product.title }}</view>
            <view>{{ product.specifications }} {{ product.unit }}</view>
            <view class="confirm-order-tag"
              ><text>{{ product.type }}</text></view
            >
          </view>
        </view>
        <view>
          <view class="confirm-order-price"
            >¥ <text>{{ product.price }}</text></view
          >
          <view>订单量 {{ product.number }}</view>
        </view>
      </view>
    </view>
    <view class="confirm-order-footer">
      <nan-button type="primary">去结算</nan-button>
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
      product: {
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
      locationIcon,
      backIcon,
    }
  },
  mounted() {
    setTitle({ title: '确认订单' })
  },
  methods: {
    handleCharge() {
      console.log('start  charge')
    },
  },
}
</script>
