<template>
  <view class="shop-page" :class="{ empty: productList.length === 0 }">
    <scroll-view v-if="productList.length" class="shop-product-wrapper" scroll-y="true" @scrolltolower="toLower">
      <view v-for="(product, index) in productList" :key="index" class="shop-product-item">
        <checkbox :checked="product.checked" @tap="change(product)"></checkbox>
        <view class="shop-product-image">
          <image :src="product.imgUrl" mode="" />
        </view>
        <view class="shop-product-detail">
          <view class="shop-product-detail-title">{{ product.title }}</view>
          <view class="shop-product-detail-info">规格: {{ product.specifications }}</view>
          <view class="shop-product-detail-info">单位: {{ product.unit }}</view>
          <view class="shop-product-detail-info">数量: {{ product.number }}</view>
          <view class="shop-product-price">
            <view class="shop-product-detail-price"
              >¥<text>{{ product.price }}</text></view
            >
            <view class="shop-product-detail-number">
              <view class="product-action-btn" @tap="decreaseProduct(product, index)">-</view>
              <text>{{ product.number }}</text>
              <view class="product-action-btn" @tap="addProduct(product)">+</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view v-else class="shop-empty">
      <view class="shop-empty-title">购物车空空如也</view>
      <view class="shop-empty-tip">赶紧慰劳一下自己吧</view>
      <view class="shop-empty-btn">
        <button @tap="go">去逛逛</button>
      </view>
    </view>
    <view class="shop-product-footer" v-if="productList.length">
      <view>
        <checkbox :checked="checkAll" @tap="handleCheckAll">全选</checkbox>
      </view>
      <view style="display: flex; align-items: center">
        <view
          >合计: ¥<text class="shop-product-total">{{ total }}</text></view
        >
        <button @tap="handleSettle">去结算</button>
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'
import Taro from '@tarojs/taro'

export default {
  data() {
    return {
      msg: '',
      productList: [],
      checked: false,
      checkAll: false,
      loading: false,
      complete: false,
      pageNo: 1,
    }
  },
  components: {},
  mounted() {
    this.getProduct()
  },
  computed: {
    total() {
      return this.productList.filter(v => v.checked).reduce((prev, cur) => prev + cur.price * cur.number, 0)
    },
  },
  methods: {
    getProduct(type) {
      // API.getProduct().then(res => {
      //   this.productList = (res.data || []).map(v => ({
      //     ...v,
      //     checked: true,
      //   }))
      //   this.checkAll = this.productList.every(v => v.checked)
      // })
      this.loading = true
      this.$API
        .getShopcarList({
          limit: 10,
          pageNo: this.pageNo,
        })
        .then(data => {
          if (type === 'loadMore') {
            this.productList = this.productList.concat(data)
          } else {
            this.productList = data
          }
          if (data.length === 0) {
            this.complete = true
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    go() {
      Taro.switchTab({ url: '/pages/product/index' })
      console.log('去逛逛')
    },
    addProduct(product) {
      product.number++
    },
    decreaseProduct(product, index) {
      if (product.number <= 1) {
        this.productList.splice(index, 1)
      } else {
        product.number--
      }
    },
    change(product) {
      product.checked = !product.checked
    },
    handleCheckAll() {
      this.checkAll = !this.checkAll
      this.productList.forEach(v => (v.checked = this.checkAll))
    },
    handleSettle() {
      console.log('去结账')
    },
    toLower() {
      if (this.loading || this.complete) {
        return
      }
      this.pageNo++
      this.getProduct('loadMore')
    },
  },
}
</script>
