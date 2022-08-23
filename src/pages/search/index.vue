<template>
  <view class="search-page">
    <view class="search-bar">
      <image class="search-icon" :src="searchIcon" mode="" />
      <input placeholder="喝出美好生活" />
    </view>
    <view class="search-result">
      <view class="search-result-empty" v-if="!productList.length">
        <image :src="searchEmptyIcon" mode="" />
        <view class="search-result-empty-text">
          抱歉，没有找到商品哦
        </view>
      </view>
      <view class="search-result-list" v-else>
        <view class="product-list">
          <view class="product-list-item" @tap="viewDetail(product)" v-for="(product, index) in productList" :key="index">
            <view class="product-list-image"><image :src="product.imgUrl" mode=""/></view>
            <view class="product-list-detail">
              <view class="product-list-title">{{ product.title }}</view>
              <view class="product-list-info">规格: {{ product.specifications }} | 单位: {{ product.unit }}</view>
              <view style="display:flex; justify-content:space-between;align-items: center;">
                <view class="product-list-price">
                  <text style="color: #f55726">¥</text>
                  <text style="color: #f55726; font-size: 22px;">{{ product.price }} </text>
                  <text style="color: #999">/ 份</text>
                </view>
                <image @tap.stop="addShop(product)" :src="shopIcon" class="shop-icon" mode="" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'
import searchIcon from '@/images/search.png'
import searchEmptyIcon from '@/images/search-empty.png'
import API from '@/service/api'
import shopIcon from '@/images/shop.png'

export default {
  name: 'search',
  data() {
    return {
      searchIcon,
      searchEmptyIcon,
      shopIcon,
      productList: [],
    }
  },
  mounted() {
    setTitle({
      title: '搜索',
    })
    this.getSearchResult()
  },
  methods: {
    getSearchResult() {
      API.getProduct().then(res => {
        this.productList = res.data || []
      })
    },

    addShop(product) {
      Taro.showToast({
        title: '添加成功',
        icon: 'success',
      })
      console.log('添加购物车')
    },
    viewDetail(product) {
      console.log('查看详情')
    },
  },
}
</script>
