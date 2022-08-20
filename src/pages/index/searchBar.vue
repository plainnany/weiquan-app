<template>
  <view class="search-bar">
    <image class="search-icon" :src="searchIcon" />
    <!-- 这里不知道为啥focus之后，样式会发生错乱 -->
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
  border-radius: 40px;
  background: #edeff2;
  margin: 0 34px;
  display: flex;
  align-items: center;

  .search-icon {
    width: 32px;
    height: 32px;
    margin-left: 30px;
  }
  input {
    flex: 1;
    box-sizing: border-box;
    padding: 21px 24px;
    height: 70px;
    color: #999;
  }

  .placeholder-style {
    height: 70px;
  }
}
</style>
