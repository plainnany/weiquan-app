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
      <view class="product-list" :key="activeIndex">
        <scroll-view :scroll-y="true" id="scroll-view" @scrolltolower="toLower">
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
        </scroll-view>
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
      searchLoading: false,
      searchComplete: false,
      searchPageNum: 1,
      // scrollTop: 0,
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
      if (this.activeIndex === index) return

      this.activeIndex = index
      this.searchPageNum = 1
      this.searchComplete = false
      // scroll-view不知为何设置scrollTop无效，通过key来解决了
      // this.scrollTop = 0
      this.getProductByCategory()
    },
    getProductByCategory(type) {
      const method = this.activeIndex === 0 ? 'getSellGoods' : 'getProductByCategory'
      const pageNo = this.searchPageNum
      const params =
        this.activeIndex === 0
          ? { pageNo, limit: 10 }
          : { pageNo, limit: 10, ProductClassCode: this.categoryList[this.activeIndex].classCode }
      this.searchLoading = true
      this.$API[method](params)
        .then(data => {
          if ((data || []).length === 0) {
            this.searchComplete = true
          }
          if (type === 'loadMore') {
            this.productList = this.productList.concat(data || [])
          } else {
            this.productList = data || []
          }
          this.searchLoading = false
        })
        .finally(() => {
          console.log('finally')
          this.searchLoading = false
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
    toLower() {
      if (this.searchLoading || this.searchComplete) {
        return
      }
      this.searchPageNum++
      this.getProductByCategory('loadMore')
    },
  },
}
</script>
