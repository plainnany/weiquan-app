<template>
  <view class="notice-page">
    <view class="notice-page-item" v-for="(item, key) in messageCenter" :key="key" @tap="handleNav(item, key)">
      <view>
        <image :src="iconMap[key]" mode="" />
      </view>
      <view class="info">
        <view class="info-title">
          {{ titleMap[key] }}
          <view v-if="item.createDtae || item.createTime" class="extra">{{ item.createDtae || item.createTime }}</view>
        </view>
        <view class="info-tip">{{ key === 'Post' ? item.postTitle : item.message || '暂时没有新的消息' }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './index.less'
import { setTitle } from '@/utils'
import orderIcon from '@/images/notice/order.png'
import systemIcon from '@/images/notice/system.png'
import postIcon from '@/images/notice/post.png'

export default {
  components: {},
  data() {
    return {
      messageCenter: {
        System: {},
        Order: {},
        Post: {},
      },
      titleMap: {
        Order: '订单消息',
        System: '系统消息',
        Post: '操作手册/公告',
      },
      iconMap: {
        Order: orderIcon,
        System: systemIcon,
        Post: postIcon,
      },
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  mounted() {
    setTitle({ title: '消息中心' })
  },
  onShow() {
    this.getNotice()
  },
  methods: {
    handleNav(item, key) {
      Taro.navigateTo({
        url: `/pages/notice/detail?title=${this.titleMap[key]}&key=${key}&post=${item.postTitle}&date=${item.createTime}&postUrl=${item.postUrl}`,
      })
    },
    getNotice() {
      this.$API.messageCenter().then(data => {
        ;['System', 'Order', 'Post'].forEach(key => {
          this.messageCenter[key] = data[key] || {}
        })
      })
    },
  },
}
</script>
