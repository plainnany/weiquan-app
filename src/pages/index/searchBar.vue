<template>
  <view class="search-bar">
    <image class="search-icon" :src="searchIcon" mode="" />
    <input type="text" @focus="focus" placeholder="喝出美好生活" placeholder-class="placeholder-style" />
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import searchIcon from '@/images/search.png'

export default {
  name: 'searchBar',
  data() {
    return { searchIcon }
  },
  methods: {
    focus() {
      // Taro.navigateTo({
      //   url: '/pages/search/index',
      // })
    },
  },
}
</script>

<style lang="less">
.search-bar {
  position: fixed;
  top: 0;
  right: 24px;
  left: 24px;
  box-sizing: border-box;
  border-radius: 40px;
  background: #edeff2;
  display: flex;
  align-items: center;
  height: 70px;
  padding: 21px 24px;

  .search-icon {
    width: 32px;
    height: 32px;
    margin-left: 30px;
    margin-right: 20px;
  }
  input {
    flex: 1;
    box-sizing: border-box;
    color: #999;
  }

  .placeholder-style {
    height: 70px;
  }
}
</style>
