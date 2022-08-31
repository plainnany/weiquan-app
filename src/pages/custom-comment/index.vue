<template>
  <view class="custom-comment">
    <view class="custom-tabs">
      <view class="custom-tab" :class="{ active: active === tab.key }" @tap="clickTab(tab)" v-for="tab in tabs" :key="tab.key">
        {{ tab.title }}</view
      >
    </view>
    <view class="custom-record">
      <scroll-view :scroll-y="true" @scrolltolower="toLower">
        <view class="custom-list">
          <view class="custom-list-item" v-for="(item, index) in complainList" :key="index">
            <view
              >客诉编号 <text>{{ item.complainCode }}</text></view
            >
            <view>{{ item.complainDate }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'

export default {
  components: {},
  data() {
    return {
      active: 'todo',
      tabs: [
        {
          title: '未处理',
          key: 'todo',
          state: '02',
        },
        {
          title: '已处理',
          key: 'done',
          state: '03',
        },
      ],
      complainList: [],
      loading: false,
      complete: false,
      pageNo: 1,
    }
  },
  mounted() {
    this.getComplainList()
    setTitle({ title: '客诉查看' })
  },
  methods: {
    clickTab({ key }) {
      this.active = key
      this.complete = false
      this.pageNo = 1
      this.getComplainList()
    },
    getComplainList(type) {
      const state = this.tabs.find(tab => tab.key === this.active).state
      this.$API
        .getComplainList({
          pageNo: this.pageNo,
          limit: 10,
          state,
        })
        .then(data => {
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
  },
}
</script>
