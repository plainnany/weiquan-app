<template>
  <view class="home-page">
    <view class="home-info">
      <SearchBar />
      <view class="banner">
        <swiper :indicator-dots="true" :autoplay="true">
          <swiper-item v-for="(banner, index) in banners" :key="index" @tap="handleLink(banner.jumpLink)">
            <image :src="banner.imageUrl" />
          </swiper-item>
        </swiper>
      </view>
      <view class="main">
        <view class="card">
          <view class="nav">
            <view @tap="handleNav('charge')" class="nav-item">
              <image :src="chargeImg" mode="" />
              <view>支付充值</view>
            </view>
            <view @tap="handleNav('sign')" class="nav-item">
              <image :src="signImg" mode="" />
              <view>快速签收</view>
            </view>
            <view @tap="handleNav('shop')" class="nav-item">
              <image :src="goShop" mode="" />
              <view>一键下单</view>
            </view>
            <view @tap="handleNav('notice')" class="nav-item">
              <image :src="noticeImg" mode="" />
              <view>重要消息</view>
            </view>
            <!-- <view class="invite" @tap="handleLink(inviteLink)">
            <image :src="inviteImg" mode="" />
            <view>
              <text class="invite-strong">一起种草</text>
              <text>邀请好友一起种草，好礼享不停</text>
              <image class="back-icon" :src="backImg" mode="" />
            </view>
          </view> -->
          </view>
          <view class="notice">
            <image :src="notificationImg" mode="" />
            <text>系统通知：</text>
            <text class="scroll-wrapper">
              <text class="scroll">
                {{ message }}
              </text>
            </text>
          </view>
        </view>
        <view class="card middle" @tap="onCategory(-1)">
          <image :src="`https://foodservice-main.oss-cn-hangzhou.aliyuncs.com/kd/kd.png`" mode="" />
        </view>

        <!-- <view class="link row">
          <view class="col">
            <view class="link-item" @tap="handleLink(gif.jumpLink)">
              <image :src="gif.fileUrl" mode="" />
            </view>
          </view>
          <view class="col">
            <view class="link-item" @tap="handleLink(video.jumpLink)">
              <video :src="video.fileUrl" />
            </view>
          </view>
        </view> -->
        <view class="product row">
          <view class="col" v-for="(product, index) in category" :key="index">
            <view class="product-item" @tap="onCategory(index)">
              <image :src="product.productImage" mode="" />
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
import goShop from '@/images/go-shop.png'
import chargeImg from '@/images/recharge.png'
import inviteImg from '@/images/invite.png'
import backImg from '@/images/red-back.png'
import Taro from '@tarojs/taro'
import { downloadImg } from '@/utils'

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
      goShop,
      chargeImg,
      inviteImg,
      backImg,
      banners: [],
      gif: '',
      video: '',
      category: '',
      message: '',
      imgUrl: '',
    }
  },
  onShow() {
    this.$store.commit('setSwitchCategoryTab', '')
    this.getData()
  },
  mounted() {
    // this.getData()
    this.downloadImage()
  },
  methods: {
    downloadImage() {
      Taro.downloadFile({
        url: 'https://foodservice-main.oss-cn-hangzhou.aliyuncs.com/kd/kd.png',
        success: res => {
          if (res.statusCode === 200) {
            this.imgUrl = res.tempFilePath
          }
        },
      })
    },
    getData() {
      this.$API.getHomeData().then(data => {
        data = data || {}
        this.banners = Array.isArray(data.banner) ? data.banner : [data.banner]
        this.gif = data.gif
        this.video = data.video
        this.category = data.classList || []
        this.message = data.SysMessage
        this.inviteLink = data.community
      })
    },
    onCategory(index) {
      this.$store.commit('setSwitchCategoryTab', index + 1)
      Taro.switchTab({
        url: `/pages/product/index`,
      })
    },
    handleNav(type) {
      const urlMap = {
        sign: '/pages/order/index?type=to-delivery',
        notice: '/pages/notice/index',
        charge: '/pages/charge/index',
        shop: '/pages/shop/index',
      }
      if (type === 'shop') {
        Taro.switchTab({ url: urlMap[type] })
      } else {
        Taro.navigateTo({
          url: urlMap[type],
        })
      }
    },
    handleLink(link) {
      if (!link) return
      if (!this.$store.state.userInfo.userId) {
        return Taro.showToast({
          title: '用户未登录，请先绑定用户',
          icon: 'none',
        })
      }
      Taro.navigateTo({ url: `/pages/web-view/index?url=${link}` })
    },
  },
}
</script>
