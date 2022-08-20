<template>
  <view class="home-page">
    <view class="home-info">
      <SearchBar />
      <Banner />
      <Nav />
      <view class="ad">一个活动图片</view>
      <News />
    </view>
    <text>测试接口数据 {{ msg }}</text>
  </view>
</template>

<script>
import './index.less'
import API from '@/service/api'
import Banner from './banner.vue'
import Nav from './nav.vue'
import News from './news.vue'
import SearchBar from './searchBar.vue'

export default {
  components: {
    Banner,
    Nav,
    News,
    SearchBar,
  },
  data() {
    return {
      msg: '',
    }
  },
  mounted() {
    API.getDetail().then(res => {
      this.msg = res.message
    })
  },
  methods: {},
}
</script>
