<template>
  <view class="home-page">
    <!-- 显示官方微信公众号关注组件 -->
    <view class="close" v-if="showOfficial && isScene">
      <nan-button @tap="closeOfficial">隐藏关注</nan-button>
    </view>
    <official-account v-if="showOfficial"></official-account>
    <view class="home-info">
      <SearchBar />
      <view class="banner">
        <swiper
          :indicator-dots="true"
          :indicator-color="'#515151'"
          :indicator-active-color="'#fff'"
          :interval="3000"
          :autoplay="true"
          :circular="true"
          :easing-function="'easeInOutCubic'"
        >
          <swiper-item v-for="(banner, index) in banners" :key="index" @tap="handleLink(banner.jumpLink)">
            <image :src="banner.imageUrl" />
          </swiper-item>
        </swiper>
        <view class="follow" v-if="showGoFollow">
          <view class="left">
            <image v-if="gzhUrl" :src="gzhUrl" />
            公众号 ·《味全饮品课堂》
          </view>
          <text class="go-follow" @tap="goFollow">去关注</text>
        </view>
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
            <view class="notice-left">
              <image :src="notificationImg" mode="" />
              <text>系统通知：</text>
            </view>
            <view class="scroll-bg">
              <view class="scroll-wrapper">
                <view class="scroll" id="scroll" ref="scroll" :style="{ animation: `roll linear ${duration}s infinite` }">
                  {{ message }}
                </view>
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
        {{ errorToast }}</view
      ></view
    >
    <view class="modal" v-if="showModal">
      <view class="modal-mask"></view>
      <view class="modal-container">
        <view class="modal-close" @tap="closeModal">
          <image src="https://foodservice-main.oss-cn-hangzhou.aliyuncs.com/gz/gzh_close.png" />
        </view>
        <view
          class="modal-content"
          :style="{ 'background-image': `url(https://foodservice-main.oss-cn-hangzhou.aliyuncs.com/gz/gzh.png)` }"
        >
          <view class="modal-btn" @tap="handleFollow">点击关注公众号</view>
        </view>
      </view>
    </view>
    <countdown-modal :visible.sync="showNewProductModal" :info="newProduct" />
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
import closeIcon from '@/images/close.png'
import checkImg from '@/images/account-check.png'
import CountdownModal from '@/components/countdown-modal/index.vue'

export default {
  components: {
    SearchBar,
    CountdownModal,
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
      errorToast: '',
      duration: '', // 文字滚动时间
      showModal: false, // 是否显示关注公众号弹窗
      showGoFollow: false, // 是否显示去关注
      showOfficial: false, // 是否显示微信公众号官方组件
      gzhUrl: '', // 公众号二维码
      closeIcon,
      scene: '',
      showNewProductModal: false, // 是否显示新品推荐的modal
      newProduct: {
        img: '', // 图片
        times: '', // 倒计时
      }, // 新品推荐数据
    }
  },
  async onShow() {
    this.$store.commit('setSwitchCategoryTab', '')
    this.scrollLength = 100
    this.getData()
    this.scene = wx.getLaunchOptionsSync().scene
    console.log('场景对应在【1047】范围内，才显示隐藏按钮')
    console.log('小程序对应的场景值：wx.getLaunchOptionsSync().scene：', this.scene)
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    // 场景值在扫码时，才显示，为了和小程序扫码显示效果一致，目前测试结果只有扫码官方组件才会显示
    isScene() {
      // 场景值文档：https://developers.weixin.qq.com/miniprogram/dev/component/official-account.html
      return [1047].includes(this.scene)
    },
  },

  mounted() {
    this.downloadImage()
    this.getNewArrival()
    this.$store.dispatch('getUserInfo').then(res => {
      // this.showGoFollow = this.userInfo.homeFlg === '01'
      // this.showModal = this.userInfo.gzhFlg === '01'
    })
  },
  beforeDestroy() {
    clearInterval(this.intervalTimer)
  },
  methods: {
    closeOfficial() {
      this.showOfficial = false
    },
    goFollow() {
      this.showOfficial = true
    },
    handleFollow() {
      this.showModal = false
      this.showOfficial = true
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
    getNewArrival() {
      return this.$API.newArrival().then(data => {
        this.newProduct = data
      })
    },
    getData() {
      return this.$API
        .getHomeData({
          unionid: Taro.getStorageSync('unionId'),
        })
        .then(data => {
          data = data || {}
          this.count = data.count > 99 ? '99+' : Number(data.count)
          this.banners = Array.isArray(data.banner) ? data.banner : [data.banner]
          this.gif = data.gif
          this.video = data.video
          this.category = data.classList || []
          this.message = data.SysMessage
          this.inviteLink = data.community
          this.showGoFollow = data.homeFlg === '01'
          this.showModal = data.gzhFlg === '01'
          this.showNewProductModal = !this.showModal
          this.gzhUrl = data.gzhUrl

          setTimeout(() => {
            const query = wx.createSelectorQuery()
            // 选择id
            query
              .select('#scroll')
              .boundingClientRect(rect => {
                this.duration = rect.width * 0.03 // 滚动文字时间，滚动速度为0.03s/px
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
    showToast(errorToast) {
      if (this.showError) return
      this.showError = true
      this.errorToast = errorToast
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.showError = false
      }, 3000)
    },
    handleNav(type) {
      const urlMap = {
        sign: '/pages/order/index?type=to-delivery',
        notice: '/pages/notice/index',
        charge: '/pages/charge/index',
        shop: '/pages/shop/index?type=all',
      }
      if (type === 'shop') {
        this.$API.placeOrder().then(res => {
          Taro.switchTab({ url: urlMap[type] })
        })
      } else {
        const canCharge = this.$store.state.userInfo.dianZhang && this.$store.state.userInfo.franchiser !== '02'
        if (type === 'charge') {
          if (canCharge) {
            Taro.navigateTo({
              url: urlMap[type],
            })
          } else {
            this.showToast('您还没有该功能的权限')
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
    closeModal() {
      this.showModal = false
      this.showNewProductModal = true
    },
  },
}
</script>
