<template>
  <view class="search-bar-wrapper">
    <view class="search-bar" @tap="focus">
      <icon class="search-icon" type="search" size="12" />
      <text class="input">商品搜索</text>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './index.less'

export default {
  name: 'searchBar',
  data() {
    return {}
  },
  methods: {
    focus() {
      Taro.navigateTo({
        url: '/pages/search/index',
      })
    },
  },
}
</script>
