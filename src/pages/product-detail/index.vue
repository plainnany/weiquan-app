<template>
  <view class="product-detail" :style="{ 'padding-bottom': footerBottom === 0 ? 0 : footerBottom + 300 + 'px' }">
    <view class="product-banner" :class="{ extra: hasDonate }">
      <swiper :autoplay="false" @change="onSwiperChange" :indicator-active-color="swiperOptions.indicatorColor" :circular="true">
        <swiper-item v-for="(imageUrl, index) in product.images" :key="index">
          <image :src="imageUrl" />
        </swiper-item>
      </swiper>
      <view class="swiper-indicator">{{ currentImage }}/{{ product.images?.length }}</view>
      <!-- 是赠品 -->
      <view class="product-banner-extra" v-if="hasDonate">
        <image :src="giftIcon" mode="widthFix" />
      </view>
      <view class="product-banner-extra-bottom" v-if="hasDonate">
        {{ product.ruleStr }}
        <view class="product-donate">
          <image :src="product.tpmImg" mode="" />
        </view>
        <view class="product-donate-name">
          <text>{{ product.tpmProductName }}</text>
        </view>
        <view class="product-donate-tag">
          <image :src="donateIcon" mode="widthFix" />
        </view>
      </view>
    </view>
    <view class="product-wrapper">
      <view class="product-card">
        <view class="product-title">{{ product.productName }}</view>
        <view class="product-size">
          <view class="product-box"> 规格: {{ product.productSpecs }} </view>
          <view class="product-box"> 单位: {{ product.productUnitMax }} </view>
        </view>
        <view class="product-number product-box">
          <view>购买数量</view>
          <view class="product-number-action">
            <view class="product-action-btn" @tap="decrease">-</view>
            <view>
              <!-- {{ product.minOrderQuantity }} -->
              <input
                type="number"
                v-model="product.minOrderQuantity"
                @tap.stop="() => {}"
                @focus.stop="() => {}"
                @blur.stop="onBlur(product)"
                @confirm="onChange"
                @keyboardheightchange="keyboardheightchange"
                placeholder=""
              />
            </view>

            <view class="product-action-btn" @tap="add">+</view>
            <view>{{ product.productUnitMin }}</view>
          </view>
        </view>
      </view>
      <!-- <view class="product-tip product-card">
        <text>服务</text>
        <text>{{ product.tip }}</text>
      </view> -->
      <view class="product-content-title">
        <view class="product-content-divider"></view>
        <text class="circle">
          详情
        </text>
      </view>
      <view class="product-content product-card">
        <view class="product-content-table">
          <view class="product-content-row">
            <view class="product-content-col">产品品牌</view>
            <view class="product-content-col">{{ product.productName }}</view>
          </view>
          <view class="product-content-row">
            <view class="product-content-col">产品规格</view>
            <view class="product-content-col">{{ product.productSpecs }}</view>
          </view>
          <view class="product-content-row">
            <view class="product-content-col">下单截止</view>
            <view class="product-content-col">{{ product.orderEndTime }}</view>
          </view>
          <view class="product-content-row">
            <view class="product-content-col">配送规则</view>
            <view class="product-content-col">{{ product.ruleStr }}</view>
          </view>
          <view class="product-content-img" v-for="(imageUrl, index) in product.images" :key="index">
            <image :src="imageUrl" mode="" />
          </view>
          <!-- <view class="product-content-row">
            <view class="product-content-col">保质期</view>
            <view class="product-content-col">{{ product.qualityPeriod }}</view>
          </view>
          <view class="product-content-row">
            <view class="product-content-col">储存方式</view>
            <view class="product-content-col">{{ '冷藏' }}</view>
          </view> -->
        </view>
      </view>
    </view>
    <view class="product-footer" :style="{ bottom: footerBottom + 'px' }">
      <!-- <view class="product-footer-action" @tap="contact">
        <image :src="serviceIcon" mode="" />
        <view>客服</view>
      </view> -->
      <view class="product-footer-btn">
        <view class="nav" @tap="handleNav('/pages/index/index')">返回首页</view>
        <view class="nav" @tap="handleNav('/pages/shop/index')">购物车</view>
        <view class="nav-shop" @tap="addShop">加入购物车</view>
        <view class="nav-primary" @tap="batchOrder">批量下单</view>
      </view>
    </view>
    <view class="toast" v-if="showToast"> <text>加入成功</text></view>
    <Modal :visible="visible" title="提示" cancelText="拨打" confirmText="确定" @cancel="contact" @confirm="() => (visible = false)">
      <view style="font-size: 12px; padding: 0 24rpx;">
        <text v-html="modalInfo.content"></text>
        <text class="contact-phone" @tap="contact">{{ modalInfo.tel }}</text>
        <text>{{ modalInfo.tips }}</text>
      </view>
    </Modal>
  </view>
</template>

<script>
import './index.less'
import Taro from '@tarojs/taro'
import serviceIcon from '@/images/service.png'
import { setTitle } from '@/utils'
import Modal from '../setting/modal.vue'
import giftIcon from '@/images/gift.png'
import donateIcon from '@/images/zeng.jpg'

export default {
  components: { Modal },
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
      productUnitRule: 0,
      currentImage: 1,
      showToast: false,
      visible: false,
      giftIcon,
      donateIcon,
      footerBottom: 0,
      pageScrollTop: 0, // 页面滚动距离
      modalInfo: {}, // 不可订弹窗提示
    }
  },
  computed: {
    // 是否有赠品
    hasDonate() {
      return this.product.isTpm === '01'
    },
  },
  created() {
    this.$instance = Taro.getCurrentInstance()
  },

  mounted() {
    setTitle({ title: ' ' })
  },
  onShow() {
    this.$store.dispatch('getUserInfo')
    this.getProduct()
  },
  onPageScroll(res) {
    this.pageScrollTop = res.scrollTop
  },
  methods: {
    keyboardheightchange(e) {
      this.footerBottom = e.detail.height
      const distance = 80
      if (this.pageScrollTop < distance) {
        wx.pageScrollTo({ scrollTop: distance })
      }
    },
    handleNav(url) {
      Taro.switchTab({ url })
    },
    onSwiperChange(e) {
      this.currentImage = e.detail.current + 1
    },
    getProduct() {
      const params = this.$instance.router.params
      let content, tel
      const tips = ',感谢!'
      // 从新品推荐过来，不可订提示使用新品推荐的文案
      // 从新品推荐过来的参数处理
      if (params.tel) {
        content = '<text style="color: rgb(255, 95, 70)">新品上市,</text> 如有需要可联系业务经理或致电服务电话咨询'
        tel = params.tel
      } else {
        content = '该商品暂不可订,如有需要可联系负责业务或致电服务电话咨询'
        tel = this.$store.state.userInfo?.customerService
      }
      this.modalInfo = {
        content,
        tel,
        tips,
      }
      this.$API
        .getProductDetail({
          productId: params.id,
        })
        .then(data => {
          data.minOrderQuantity = data.minOrderQuantity || 0
          data.images = data.images || []
          this.product = data
          this.productUnitRule = parseInt(this.product.productUnitRule)
          this.minOrderQuantity = parseInt(this.product.minOrderQuantity)
        })
    },
    add() {
      // 这个是数量还是加减的单位，和购物车的好像不一样，确认一下
      this.product.minOrderQuantity = parseInt(this.productUnitRule) + parseInt(this.product.minOrderQuantity)
    },
    decrease() {
      if (this.product.minOrderQuantity <= this.minOrderQuantity) return
      this.product.minOrderQuantity = parseInt(this.product.minOrderQuantity) - parseInt(this.productUnitRule)
    },
    checkAddShop() {
      if (!this.product.sell) {
        this.visible = true
      }

      return this.product.sell
    },
    addShop() {
      if (!this.checkAddShop()) return
      this.$API
        .addToShopcar({
          productId: this.product.productId,
          amount: this.product.minOrderQuantity,
        })
        .then(data => {
          this.showToast = true

          setTimeout(() => {
            this.showToast = false
          }, 3000)
          // Taro.showToast({
          //   title: '添加成功',
          //   icon: 'success',
          // })
        })
        .catch(data => {
          Taro.showToast({
            title: data.msg,
            icon: 'error',
          })
        })
    },
    batchOrder() {
      if (!this.checkAddShop()) return
      Taro.navigateTo({
        url: `/pages/confirm-order/index?type=batch&productId=${this.product.productId}&sum=${this.product.minOrderQuantity}`,
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
    onBlur(product) {
      this.footerBottom = 0
      if (!product.minOrderQuantity) return
      product.minOrderQuantity = parseInt(product.minOrderQuantity)
    },
    onChange() {},
  },
}
</script>
