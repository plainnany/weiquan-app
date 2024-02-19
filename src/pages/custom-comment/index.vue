<template>
  <view class="custom-comment">
    <view class="custom-tabs">
      <view class="custom-tab" :class="{ active: activeIndex === tab.index }" @tap="clickTab(tab)" v-for="tab in tabs" :key="tab.key">
        {{ tab.title }}</view
      >
    </view>
    <view class="custom-add-btn" @tap="handleClick({})">+</view>
    <view class="custom-record" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
      <scroll-view :scroll-y="true" @scrolltolower="toLower">
        <view class="custom-list" v-if="complainList.length > 0">
          <view class="custom-list-item" v-for="(item, index) in complainList" :key="index" @tap="handleClick(item)">
            <view
              >{{ active === 'todo' ? '单号' : '编号' }}： <text>{{ item.complainCode }}</text></view
            >
            <view>{{ item.complainDate }}</view>
            <view class="custom-comment-status" v-if="active === 'done'">已处理</view>
          </view>
        </view>
        <view class="empty" v-else>暂无数据</view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './index.less'
import { setTitle } from '@/utils'

export default {
  components: {},
  data() {
    return {
      active: 'todo',
      activeIndex: 0,
      tabs: [
        {
          title: '未处理',
          key: 'todo',
          state: '02',
          index: 0,
        },
        {
          title: '已处理',
          key: 'done',
          state: '03',
          index: 1,
        },
      ],
      complainList: [],
      loading: false,
      complete: false,
      pageNo: 1,
      fetchOrder: 0,
      startX: '',
    }
  },
  mounted() {
    setTitle({ title: '查看客诉' })
  },
  onShow() {
    this.getComplainList()
  },
  watch: {
    activeIndex: {
      immediate: true,
      handler(val) {
        this.complete = false
        this.pageNo = 1
        this.getComplainList()
      },
    },
  },
  methods: {
    clickTab({ key, index }) {
      this.active = key
      this.activeIndex = index
    },
    getComplainList(type) {
      const state = this.tabs.find(tab => tab.key === this.active).state
      this.fetchOrder++
      const fetchOrder = this.fetchOrder
      this.$API
        .getComplainList({
          pageNo: this.pageNo,
          limit: 10,
          state,
        })
        .then(data => {
          if (this.fetchOrder !== fetchOrder) return
          data = data || []
          if (type === 'loadMore') {
            this.complainList = this.complainList.concat(data)
          } else {
            this.complainList = data
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
      this.getComplainList('loadMore')
    },
    handleClick(item) {
      if (item.complainCode) {
        Taro.navigateTo({ url: `/pages/comment/index?code=${item.complainCode}&type=${this.active}` })
      } else {
        Taro.navigateTo({ url: `/pages/comment/index?type=add` })
      }
    },
    touchstart(e) {
      this.moving = true
      if (e.touches.length == 1) {
        this.startX = e.touches[0].clientX
      }
    },
    touchmove(e) {
      if (!this.moving) return
      if (e.touches.length == 1) {
        const moveX = e.touches[0].clientX
        const disX = this.startX - moveX
        if (Math.abs(disX) > 5) {
          // 向左滑动
          if (disX > 0) {
            this.moving = false
            this.activeIndex++
            if (this.activeIndex === this.tabs.length) {
              this.activeIndex = this.tabs.length - 1
            }
          } else {
            this.moving = false
            this.activeIndex--
            if (this.activeIndex <= 0) {
              this.activeIndex = 0
            }
          }
        }
      }
    },
    touchend(e) {
      this.moving = false
    },
  },
}
</script>
