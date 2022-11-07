<template>
  <view class="home-page">
    <view class="home-info">
      <SearchBar />
      <view class="banner">
        <swiper :indicator-dots="false" :autoplay="false">
          <swiper-item v-for="(banner, index) in banners" :key="index" @tap="handleLink(banner.jumpLink)">
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
          <swiper :indicator-dots="true" :autoplay="false" :indicator-color="'#B3B2B2'" :indicator-active-color="'#FA4A2D'">
            <swiper-item>
              <view class="nav-item">
                <view @tap="handleNav('sign')">
                  <image :src="signImg" mode="" />
                  <view>签收</view>
                </view>
                <view class="divider"></view>
                <view @tap="handleNav('notice')">
                  <image :src="noticeImg" mode="" />
                  <view>消息</view>
                </view>
              </view>
            </swiper-item>
            <swiper-item>
              <view class="nav-item">
                <view @tap="handleNav('charge')">
                  <image :src="chargeImg" mode="" />
                  <view>充值</view>
                </view>
                <view class="divider"></view>
                <view @tap="handleNav('category')">
                  <image :src="categoryImg" mode="" />
                  <view>分类</view>
                </view>
              </view>
            </swiper-item>
          </swiper>
          <view class="invite" @tap="handleLink(inviteLink)">
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
            <view class="link-item" @tap="handleLink(gif.jumpLink)">
              <image :src="gif.fileUrl" mode="" />
            </view>
          </view>
          <view class="col">
            <view class="link-item" @tap="handleLink(video.jumpLink)">
              <video :src="video.fileUrl" />
            </view>
          </view>
        </view>
        <view class="product row">
          <view class="col" v-for="(product, index) in category" :key="index">
            <view class="product-item" @tap="onCategory(index)">
              <view class="product-text">{{ product.productClass }}</view>
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
import categoryImg from '@/images/category.png'
import chargeImg from '@/images/recharge.png'
import inviteImg from '@/images/invite.png'
import backImg from '@/images/red-back.png'
import Taro from '@tarojs/taro'

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
      banners: [],
      gif: '',
      video: '',
      category: '',
      message: '',
    }
  },
  onShow() {
    this.$store.commit('setSwitchCategoryTab', '')
    this.getData()
  },
  mounted() {
    // this.getData()
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
        sign: '/pages/order/index',
        notice: '/pages/user/index',
        charge: '/pages/charge/index',
        category: '/pages/product/index',
      }
      if (type === 'category' || type === 'notice') {
        Taro.switchTab({ url: urlMap[type] })
      } else {
        Taro.navigateTo({
          url: urlMap[type],
        })
      }
    },
    handleLink(link) {
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
