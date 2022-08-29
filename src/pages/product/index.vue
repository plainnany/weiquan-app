<template>
  <view class="product-page">
    <SearchBar />
    <view class="product-wrapper">
      <view class="product-items">
        <view
          class="product-category"
          :class="{ active: activeIndex === index }"
          v-for="(category, index) in categoryList"
          :key="index"
          @tap="handleCategory(index)"
        >
          {{ category.productClass }}
        </view>
      </view>
      <view class="product-list">
        <view>
          <view class="product-list-item" @tap="viewDetail(product)" v-for="(product, index) in productList" :key="index">
            <view class="product-list-image"><image :src="product.productImage" mode=""/></view>
            <view class="product-list-detail">
              <view class="product-list-title">{{ product.productName }}</view>
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
import Taro from '@tarojs/taro'
import './index.less'
import API from '@/service/api'
import SearchBar from '../index/searchBar.vue'
import shopIcon from '@/images/shop.png'
import NanModal from '@/components/modal'
import { BASE_URL } from '@/const'

export default {
  components: { SearchBar, NanModal },
  data() {
    return {
      activeIndex: 0,
      categoryList: [
        {
          classCode: '500101',
          productClass: '可定品项',
        },
      ],
      productList: [],
      shopIcon,
    }
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    getCategory() {
      API.getCategory().then(data => {
        this.categoryList = this.categoryList.concat(data)
        const firstCategory = data[0]
        if (firstCategory) {
          this.getProductByCategory(0)
        }
      })
    },
    handleCategory(index) {
      this.activeIndex = index
      this.getProductByCategory(index)
    },
    getProductByCategory(index) {
      const method = index === 0 ? 'getSellGoods' : 'getProductByCategory'
      const params = index === 0 ? { pageNo: 1, limit: 10 } : { pageNo: 1, limit: 10, ProductClassCode: this.categoryList[index].classCode }
      this.$API[method](params).then(data => {
        console.log(data)
        this.productList = data || []
      })
    },
    addShop(product) {
      Taro.showToast({
        title: '添加成功',
        icon: 'success',
      })
    },
    viewDetail(product) {
      Taro.navigateTo({ url: `/pages/product-detail/index?id=${product.productId}` })
    },
  },
}
</script>
