<template>
  <view class="home-page">
    <view class="home-info">
      <SearchBar />
      <view class="banner">
        <swiper :indicator-dots="true" :autoplay="true" :circular="true">
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
              <view>充值支付</view>
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
              <view class="dot" v-if="count">{{ count }}</view>
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
            <view
              class="scroll-wrapper"
              :style="{ overflow: startScroll ? 'hidden' : '', width: startScroll ? 'calc(100% - 180rpx)' : 'auto' }"
            >
              <view
                class="scroll"
                id="scroll"
                ref="scroll"
                :style="{ transform: `translateX(-${distance}px)`, transition: distance > 0 ? 'all 0.3s' : '' }"
              >
                {{ message }}
              </view>
            </view>
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

    <view class="toast" v-show="showError">
      <view class="toast-content">
        <image :src="checkImg" mode="widthFix" />
        您还没有该功能的权限</view
      ></view
    >
    <!-- <button @tap="test">点击</button> -->
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
import checkImg from '@/images/account-check.png'

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
      count: '',
      showError: false,
      checkImg,

      step: 1, // 滚动速度
      distance: 0, // 初始滚动距离
      space: 300,
      interval: 50, // 时间间隔
      startScroll: false,
      scrollLength: 100,
    }
  },
  onShow() {
    this.$store.commit('setSwitchCategoryTab', '')
    this.scrollLength = 100
    this.getData()
  },

  mounted() {
    // this.getData()
    this.downloadImage()
    this.$store.dispatch('getUserInfo')
  },
  beforeDestroy() {
    clearInterval(this.intervalTimer)
  },
  methods: {
    // test() {
    //   Taro.requestSubscribeMessage({
    //     tmplIds: ['rSaHYjHdAcQ1sWDefbdUoxNfiC7OnsaiDQYu_T3Fga8'],
    //     success(res) {},
    //   })
    // },
    scrollling() {
      const length = this.scrollLength // 滚动文字的宽度
      this.intervalTimer = setInterval(() => {
        const maxWidth = length - 10
        const left = this.distance
        if (left < maxWidth) {
          // 判断是否滚动到最大宽度
          this.distance = left + this.step
        } else {
          this.distance = 0
          clearInterval(this.intervalTimer)
          this.scrollling()
        }
      }, this.interval)
    },
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
        this.count = data.count > 99 ? '99+' : Number(data.count)
        this.banners = Array.isArray(data.banner) ? data.banner : [data.banner]
        this.gif = data.gif
        this.video = data.video
        this.category = data.classList || []
        this.message = data.SysMessage
        this.inviteLink = data.community

        setTimeout(() => {
          const query = wx.createSelectorQuery()
          // 选择id
          query
            .select('#scroll')
            .boundingClientRect(rect => {
              this.windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕宽度
              this.scrollLength = rect.width
              this.space = this.windowWidth
              console.log(this.scrollLength)
              this.startScroll = true
              clearInterval(this.intervalTimer)
              this.scrollling() // 第一个字消失后立即从右边出现
            })
            .exec()
        }, 50)
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
        const canCharge = this.$store.state.userInfo.dianZhang && this.$store.state.userInfo.franchiser !== '02'
        if (type === 'charge') {
          if (canCharge) {
            Taro.navigateTo({
              url: urlMap[type],
            })
          } else {
            if (this.showError) return
            this.showError = true
            this.timer = setTimeout(() => {
              clearTimeout(this.timer)
              this.showError = false
            }, 3000)
          }
        } else {
          Taro.navigateTo({
            url: urlMap[type],
          })
        }
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
      Taro.navigateTo({ url: `/pages/web-view/index?url=${encodeURIComponent(link)}` })
    },
  },
}
</script>
