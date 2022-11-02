<template>
  <view class="home-page">
    <view class="home-info">
      <SearchBar />
      <view class="banner">
        <swiper :indicator-dots="false" :autoplay="false">
          <swiper-item v-for="(banner, index) in banners" :key="index">
            <image :src="banner.fileUrl" />
          </swiper-item>
        </swiper>
      </view>
      <view class="main">
        <view class="notice card">
          <image :src="notificationImg" mode="" />
          <text>{{ message }}</text>
        </view>
        <view class="nav card">
          <swiper :indicator-dots="true" :autoplay="false" :indicator-color="'#B3B2B2'">
            <swiper-item>
              <view class="nav-item">
                <view>
                  <image :src="signImg" mode="" />
                  <view>签收</view>
                </view>
                <view class="divider"></view>
                <view>
                  <image :src="noticeImg" mode="" />
                  <view>消息</view>
                </view>
              </view>
            </swiper-item>
            <swiper-item>
              <view class="nav-item">
                <view>
                  <image :src="chargeImg" mode="" />
                  <view>充值</view>
                </view>
                <view class="divider"></view>
                <view>
                  <image :src="categoryImg" mode="" />
                  <view>分类</view>
                </view>
              </view>
            </swiper-item>
          </swiper>
          <view class="invite">
            <image :src="inviteImg" mode="" />
            <view>
              <text class="invite-strong">一起种草</text>
              <text>邀请好友一起种草，好礼享不停</text>
              <image class="back-icon" :src="backImg" mode="" />
            </view>
          </view>
        </view>
        <view class="link row">
          <view class="col">
            <view class="link-item">
              <image :src="gif.fileUrl" mode="" />
            </view>
          </view>
          <view class="col">
            <view class="link-item">
              <video :src="video.fileUrl" />
            </view>
          </view>
        </view>
        <view class="product row">
          <view class="col" v-for="product in category" :key="product.id">
            <view class="product-item">
              <view class="product-text">{{ product.productClass }}</view>
              <image :src="product.productImage" mode="" />
              <view class="product-tag"> <text>我太牛了</text></view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'
import SearchBar from './searchBar.vue'
import signImg from '@/images/sign-home.png'
import noticeImg from '@/images/notice.png'
import notificationImg from '@/images/notification.png'
import categoryImg from '@/images/category.png'
import chargeImg from '@/images/recharge.png'
import inviteImg from '@/images/invite.png'
import backImg from '@/images/red-back.png'

export default {
  components: {
    SearchBar,
  },
  data() {
    return {
      msg: '',
      signImg,
      notificationImg,
      noticeImg,
      categoryImg,
      chargeImg,
      inviteImg,
      backImg,
      swiperOptions: {
        background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 2000,
        indicatorColor: '#FA4A2D',
      },
      banners: [],
      gif: '',
      video: '',
      category: '',
      message: '',
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$API.getHomeData().then(data => {
        data = data || {}
        this.banners = [data.banner] || []
        this.gif = data.gif
        this.video = data.video
        this.category = data.classList || []
        this.message = data.sysMessage
      })
    },
  },
}
</script>
