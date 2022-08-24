<template>
  <view class="product-detail">
    <view class="product-banner">
      <swiper
        :indicator-dots="swiperOptions.indicatorDots"
        :autoplay="swiperOptions.autoplay"
        :interval="swiperOptions.interval"
        :indicator-color="swiperOptions.indicatorColor"
      >
        <swiper-item v-for="(banner, index) in product.banners" :key="index">
          <image :src="banner.imageUrl" />
        </swiper-item>
      </swiper>
    </view>
    <view class="product-wrapper">
      <view class="product-card">
        <view class="product-info">
          <view class="product-price">
            <text>¥</text>
            <text>{{ product.price }}</text>
            <text>/份</text>
          </view>
          <view class="product-tags">
            <text class="product-tag" v-for="(tag, index) in product.tags" :key="index">{{ tag }}</text>
          </view>
        </view>
        <view class="product-title">{{ product.name }}</view>
        <view class="product-size">
          <text>规格: {{ product.size }}</text>
          <text>单位: {{ product.unit }}</text>
        </view>
        <view class="product-number">
          <view>购买数量</view>
          <view class="product-number-action">
            <view class="product-action-btn" @tap="decrease">-</view>
            <view>{{ product.number }}</view>
            <view class="product-action-btn" @tap="add">+</view>
            <view>瓶</view>
          </view>
        </view>
      </view>
      <view class="product-tip product-card">
        <text>服务</text>
        <text>{{ product.tip }}</text>
      </view>
      <view class="product-content product-card">
        <view class="product-content-title">规格信息</view>
        <view class="product-content-table">
          <view class="product-content-row">
            <view class="product-content-col">名称</view>
            <view class="product-content-col">{{ product.name }}</view>
          </view>
          <view class="product-content-row">
            <view class="product-content-col">规格</view>
            <view class="product-content-col">{{ product.size }}</view>
          </view>
          <view class="product-content-row">
            <view class="product-content-col">保质期</view>
            <view class="product-content-col">{{ product.qualityPeriod }}</view>
          </view>
          <view class="product-content-row">
            <view class="product-content-col">储存方式</view>
            <view class="product-content-col">{{ '冷藏' }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="product-footer">
      <view class="product-footer-action" @tap="contact">
        <image :src="serviceIcon" mode="" />
        <view>客服</view>
      </view>
      <view class="product-footer-btn">
        <nan-button type="primary" @tap="addShop">加入购物车</nan-button>
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'
import Taro from '@tarojs/taro'
import serviceIcon from '@/images/service.png'
import { setTitle } from '@/utils'

export default {
  components: {},
  data() {
    return {
      serviceIcon,
      product: {
        price: '39.8',
        tags: ['入口清甜', '好吃不腻'],
        name: '950g味全多谷粒乳饮品',
        size: '950g',
        unit: '1箱',
        number: 12,
        tip: '品质保证，牛奶不支持7天无理由退货',
        qualityPeriod: '39天',
        banners: [
          {
            imageUrl: 'https://img.zcool.cn/community/01d0e05bc92bd3a801213deaad33ef.png@1280w_1l_2o_100sh.png',
          },
          {
            imageUrl: 'https://img.zcool.cn/community/01d0e05bc92bd3a801213deaad33ef.png@1280w_1l_2o_100sh.png',
          },
        ],
      },
      swiperOptions: {
        background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 2000,
        indicatorColor: '#FA4A2D',
      },
      $instance: null,
    }
  },
  computed: {},
  created() {
    this.$instance = Taro.getCurrentInstance()
  },

  mounted() {
    setTitle({ title: '产品详情' })
    this.getProduct()
  },
  methods: {
    getProduct() {
      const params = this.$instance.router.params
      console.log(params)
    },
    add() {
      this.product.number++
    },
    decrease() {
      if (this.product.number < 1) return
      this.product.number--
    },
    addShop() {
      console.log('添加购物车')
    },
    contact() {
      Taro.makePhoneCall({
        phoneNumber: '123456',
      })
    },
  },
}
</script>
