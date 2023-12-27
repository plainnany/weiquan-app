<template>
  <view class="notice-detail">
    <view class="post" v-if="key === 'Post'" @tap="navPostDetail">
      <view class="post-title">{{ postTitle }}</view>
      <view class="post-date">{{ postDate }}</view>
    </view>
    <scroll-view :scroll-y="true" @scrolltolower="toLower" v-else>
      <view class="notice-wrapper">
        <view class="notice-detail-item" v-for="(item, index) in detailList" :key="index">
          <view class="date">{{ item.createDtae }}</view>
          <view class="content">
            {{ item.message }}
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './index.less'
import { setTitle } from '@/utils'
import './detail.less'

export default {
  components: {},
  data() {
    return {
      messageCenter: {},
      titleMap: {},
      detailList: [],
      pageNo: 1,
      key: '',
      postTitle: '',
      postDate: '',
      postUrl: '',
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  mounted() {
    const { title, key } = Taro.getCurrentInstance().router.params
    this.key = key
    setTitle({ title })
  },
  onShow() {
    const { key, post, date, postUrl } = Taro.getCurrentInstance().router.params
    this.key = key
    this.postTitle = post
    this.postDate = date
    this.pageNo = 1
    this.getNotice()
  },
  methods: {
    getNotice(type) {
      const method = {
        Order: 'loadOrderMessage',
        System: 'loadSystemMessage',
        Post: 'companyPost',
      }[this.key]
      if (!method) return
      this.$API[method]({
        pageNo: this.pageNo,
        limit: 10,
        type: '01',
      }).then(data => {
        data = data || []
        if (this.key === 'Post') {
          this.postUrl = data[0]?.postUrl
        }
        if (type === 'loadMore') {
          this.detailList = this.detailList.concat(data)
        } else {
          this.complainList = data
          this.detailList = data || []
        }
        if (data.length === 0) {
          this.complete = true
        }
      })
    },
    toLower() {
      if (this.loading || this.complete) {
        return
      }
      this.pageNo++
      this.getNotice('loadMore')
    },
    navPostDetail() {
      if (!this.postUrl) return
      Taro.navigateTo({
        url: `/pages/web-view/index?url=${encodeURIComponent(this.postUrl)}`,
      })
    },
  },
}
</script>
