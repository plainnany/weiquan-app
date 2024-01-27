<template>
  <view class="search-page">
    <view class="search-bar">
      <view class="search-wrap">
        <view class="search-input">
          <icon class="search-icon" type="search" size="14" :color="'#fff'" />
          <input placeholder="请输入商品名称搜索" :value="keyword" @confirm="onSearch" />
        </view>
        <view class="cancel-btn" @tap="onCancel">取消</view>
      </view>
    </view>
    <view class="search-result">
      <view class="search-result-empty" v-if="!productList.length && startSearch">
        <image :src="searchEmptyIcon" mode="" />
        <view class="search-result-empty-text">
          抱歉，没有找到商品哦
        </view>
      </view>
      <scroll-view :scroll-y="true" v-else @scrolltolower="toLower">
        <view class="product-list-item" @tap="viewDetail(product)" v-for="(product, index) in productList" :key="index">
          <view class="product-list-image"><image :src="product.productImage" mode=""/></view>
          <view class="product-list-detail">
            <view class="product-list-title">{{ product.productName }}</view>
            <!-- <view class="product-list-info">规格: {{ product.specifications }} | 单位: {{ product.productUnitRule }}</view> -->
            <view style="display:flex; justify-content:space-between;align-items: center;">
              <view class="product-list-price">
                <!-- <text style="color: #f55726">¥</text>
                <text style="color: #f55726; font-size: 22px;">{{ product.productUnitRule }} </text>
                <text style="color: #999">/ 份</text> -->
              </view>
              <image @tap.stop="addShop(product)" :src="shopIcon" class="shop-icon" mode="" />
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <Modal :visible="visible" title="提示" cancelText="拨打" confirmText="确定" @cancel="contact" @confirm="() => (visible = false)">
      <view style="font-size: 12px; padding: 0 24rpx;"
        >该商品暂不可订,如有需要可联系负责业务或致电服务电话咨询
        <text class="contact-phone" @tap="contact">{{ $store.state.userInfo?.customerService || '' }}</text>
        ,感谢!</view
      >
    </Modal>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './index.less'
import { setTitle } from '@/utils'
import searchEmptyIcon from '@/images/search-empty.png'
import shopIcon from '@/images/add-shop.png'
import deleteIcon from '@/images/delete.png'
import Modal from '../setting/modal.vue'

export default {
  name: 'search',
  components: {
    Modal,
  },
  data() {
    return {
      searchEmptyIcon,
      shopIcon,
      productList: [],
      startSearch: null,
      deleteIcon,
      keyword: '',
      searchLoading: false,
      searchPageNum: 1,
      searchComplete: false,
      redirect: '',
      visible: false,
    }
  },
  onShow() {
    this.startSearch = null
  },
  mounted() {
    setTitle({
      title: '搜索',
    })
    const { redirect } = Taro.getCurrentInstance().router.params
    this.redirect = redirect
  },
  methods: {
    addShop(product) {
      if (!product.sell) {
        this.visible = true
        return
      }
      this.$API
        .addToShopcar({
          productId: product.productId,
          amount: product.productUnitRule,
        })
        .then(data => {
          Taro.showToast({
            title: '添加成功',
            icon: 'success',
          })
        })
        .catch(err => {
          Taro.showToast({
            title: err.msg,
            icon: 'error',
          })
        })
    },
    viewDetail(product) {
      Taro.navigateTo({ url: `/pages/product-detail/index?id=${product.productId}` })
    },
    onSearch(e) {
      const { value } = e.detail
      this.keyword = value || ''
      this.searchProduct({ keyword: value, pageNo: 1 })
    },
    searchProduct(params) {
      this.searchLoading = true
      const { type, ...restParams } = params
      this.$API
        .searchProduct({
          limit: 10,
          ...restParams,
        })
        .then(data => {
          if (type === 'loadMore') {
            this.productList = this.productList.concat(data)
          } else {
            this.productList = data
          }
          if (data.length === 0) {
            this.searchComplete = true
          }
        })
        .catch(err => {
          Taro.showToast({
            title: err.msg,
            icon: 'error',
          })
        })
        .finally(() => {
          this.startSearch = true
          this.searchLoading = false
        })
    },
    deleteKeyword() {
      this.searchProduct({ pageNo: 1, keyword: '' })
      this.keyword = ''
    },
    toLower() {
      if (this.searchLoading || this.searchComplete) {
        return
      }
      this.searchPageNum++
      this.searchProduct({ pageNo: this.searchPageNum, keyword: this.keyword, type: 'loadMore' })
    },
    onCancel() {
      const path = this.redirect || 'index'
      Taro.switchTab({ url: `/pages/${path}/index` })
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
