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
          {{ category.name }}
        </view>
      </view>
      <view class="product-list">
        <view v-if="categoryList[activeIndex]">
          <view
            class="product-list-item"
            @tap="viewDetail(product)"
            v-for="(product, index) in categoryList[activeIndex].list"
            :key="index"
          >
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
      categoryList: [],
      shopIcon,
    }
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    getCategory() {
      API.getCategory().then(res => {
        this.categoryList = res.data
      })
    },
    handleCategory(index) {
      this.activeIndex = index
    },
    addShop(product) {
      Taro.showToast({
        title: '添加成功',
        icon: 'success',
      })
      console.log('添加购物车')
    },
    viewDetail(product) {
      Taro.navigateTo({ url: `/pages/product-detail/index?id=${product.id}` })
      console.log('查看详情')
    },
  },
}
</script>
