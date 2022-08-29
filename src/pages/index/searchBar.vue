<template>
  <view class="search-bar">
    <icon class="search-icon" type="search" size="16" />
    <input type="text" @focus="focus" placeholder="喝出美好生活" placeholder-class="placeholder-style" />
  </view>
</template>

<script>
import Taro from '@tarojs/taro'

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

<style lang="less">
.search-bar {
  display: flex;
  align-items: center;
  border-radius: 40px;
  background: #edeff2;
  padding: 21px 24px;
  font-size: 28px;

  icon {
    margin-right: 30px;
    margin-left: 20px;
  }
}
</style>
