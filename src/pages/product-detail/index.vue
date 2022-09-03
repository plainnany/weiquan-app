<template>
  <view class="product-detail">
    <view class="product-banner">
      <swiper
        :indicator-dots="swiperOptions.indicatorDots"
        :autoplay="swiperOptions.autoplay"
        :interval="swiperOptions.interval"
        :indicator-color="swiperOptions.indicatorColor"
      >
        <swiper-item v-for="(imageUrl, index) in product.images" :key="index">
          <image :src="imageUrl" />
        </swiper-item>
      </swiper>
    </view>
    <view class="product-wrapper">
      <view class="product-card">
        <view class="product-info">
          <view class="product-price" v-show="product.price">
            <text>¥</text>
            <text>{{ product.price }}</text>
            <text>/份</text>
          </view>
          <!-- <view class="product-tags">
            <text class="product-tag" v-for="(tag, index) in product.tags" :key="index">{{ tag }}</text>
          </view> -->
        </view>
        <view class="product-title">{{ product.productName }}</view>
        <view class="product-size">
          <text>规格: {{ product.productSpecs }}</text>
          <text>单位: {{ product.productUnitMax }}</text>
        </view>
        <view class="product-number">
          <view>购买数量</view>
          <view class="product-number-action">
            <view class="product-action-btn" @tap="decrease">-</view>
            <view>{{ product.productUnitRule }}</view>
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
            <view class="product-content-col">{{ product.productName }}</view>
          </view>
          <view class="product-content-row">
            <view class="product-content-col">规格</view>
            <view class="product-content-col">{{ product.productSpecs }}</view>
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
      product: {},
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
  },
  onShow() {
    this.getProduct()
  },
  methods: {
    getProduct() {
      const params = this.$instance.router.params
      this.$API
        .getProductDetail({
          productId: params.id,
        })
        .then(data => {
          this.product = data
        })
    },
    add() {
      this.product.productUnitRule++
    },
    decrease() {
      if (this.product.productUnitRule < 1) return
      this.product.productUnitRule--
    },
    addShop() {
      this.$API
        .addToShopcar({
          productId: this.product.productId,
          amount: this.product.productUnitRule,
        })
        .then(data => {
          Taro.showToast({
            title: '添加成功',
            icon: 'success',
          })
        })
        .catch(data => {
          Taro.showToast({
            title: data.msg,
            icon: 'error',
          })
        })
    },
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
  },
}
</script>
