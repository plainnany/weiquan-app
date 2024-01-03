<template>
  <view class="product-page">
    <icon class="search-icon" type="search" size="12" @tap="goSearch" />
    <view class="product-items">
      <scroll-view :scroll-x="true" :key="scrollViewKey" :scroll-into-view="scrollId">
        <view
          class="product-category"
          :class="{ active: activeIndex === index }"
          :id="`product-id-${index}`"
          v-for="(category, index) in categoryList"
          :key="index"
          @tap="handleCategory(index)"
        >
          {{ category.productClass }}
        </view>
      </scroll-view>
    </view>
    <view class="product-wrapper">
      <view class="product-list" :key="activeIndex">
        <scroll-view :scroll-y="true" id="scroll-view" @scrolltolower="toLower">
          <view class="scroll-inner">
            <view class="product-list-item" @tap="viewDetail(product)" v-for="(product, index) in productList" :key="index">
              <view class="product-list-image"><image :src="product.productImage" mode=""/></view>
              <view class="product-list-detail">
                <view class="product-list-title">
                  <text class="sell" v-if="product.sell">订</text>
                  {{ product.productName }}</view
                >
              </view>
              <!-- 是赠品 -->
              <view class="product-list-extra" v-if="product.isTpm === '01'">
                <image :src="giftIcon" mode="widthFix" />
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
import giftIcon from '@/images/gift.png'

export default {
  components: { SearchBar, NanModal },
  data() {
    return {
      activeIndex: 0,
      giftIcon,
      categoryList: [
        {
          classCode: 'special',
          productClass: '可订品项',
        },
      ],
      productList: [],
      shopIcon,
      searchLoading: false,
      searchComplete: false,
      searchPageNum: 1,
      // scrollTop: 0,
      scrollId: '',
      scrollViewKey: '',
    }
  },
  computed: {},
  mounted() {
    // this.getCategory()
  },
  onShow() {
    this.categoryList = [
      {
        classCode: 'special',
        productClass: '可订品项',
      },
    ]
    this.categoryIndex = this.$store.state.switchCategoryTab
    this.activeIndex = this.categoryIndex || 0
    this.searchPageNum = 1
    this.searchComplete = false
    this.getCategory()
    this.scrollViewKey = parseInt(Math.random() * 1000)
  },
  methods: {
    getCategory() {
      API.getCategory().then(data => {
        // 过滤掉600212和600213,产品说不需要显示
        data = data.filter(v => v.classCode !== '600212' && v.classCode !== '600213')
        this.categoryList = this.categoryList.concat(data)
        this.$nextTick(() => {
          this.scrollId = `product-id-${this.activeIndex}`
          this.scrollViewKey = parseInt(Math.random() * 1000)
        })
        const firstCategory = data[0]
        if (!firstCategory) return
        this.getProductByCategory()
      })
    },
    handleCategory(index) {
      if (this.activeIndex === index) return

      this.activeIndex = index
      this.searchPageNum = 1
      this.searchComplete = false
      // scroll-view不知为何设置scrollTop无效，通过key来解决了
      // this.scrollTop = 0
      this.$store.commit('setSwitchCategoryTab', index)

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
          this.searchLoading = false
        })
    },
    addShop(product) {
      if (!product.sell) {
        Taro.showToast({
          title: '当前商品不支持购买',
          icon: 'none',
        })
        return
      }
      this.$API
        .addToShopcar({
          productId: product.productId,
          amount: product.minOrderQuantity,
        })
        .then(data => {
          Taro.showToast({
            title: '添加成功',
            icon: 'success',
          })
        })
        .catch(data => {
          Taro.showToast({
            title: data.msg,
            icon: 'error',
          })
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
    goSearch() {
      Taro.navigateTo({
        url: '/pages/search/index?redirect=product',
      })
    },
  },
}
</script>
