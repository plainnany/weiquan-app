<template>
  <view class="shop-page">
    <view v-if="productList.length" class="shop-product-wrapper">
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
            <view class="shop-product-detail-price">¥{{ product.price }}</view>
            <view class="shop-product-detail-number">
              <button @tap="decreaseProduct(product)">-</button>
              <text>{{ product.number }}</text>
              <button @tap="addProduct(product)">+</button>
            </view>
          </view>
        </view>
      </view>
      <view class="shop-product-footer">
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
    <view v-else class="shop-empty">
      <view class="shop-empty-title">购物车空空如也</view>
      <view class="shop-empty-tip">赶紧慰劳一下自己吧</view>
      <view class="shop-empty-btn">
        <button @tap="go">去逛逛</button>
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'
import API from '@/service/api'

export default {
  data() {
    return {
      msg: '',
      productList: [],
      checked: false,
      checkAll: false,
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
    getProduct() {
      API.getProduct().then(res => {
        this.productList = (res.data || []).map(v => ({
          ...v,
          checked: true,
        }))
        this.checkAll = this.productList.every(v => v.checked)
      })
    },
    go() {
      console.log('去逛逛')
    },
    addProduct(product) {
      product.number++
    },
    decreaseProduct(product) {
      product.number--
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
  },
}
</script>
