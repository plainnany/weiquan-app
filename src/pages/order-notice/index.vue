<template>
  <view class="order-notice">
    <view class="notice-action" @tap="addNotice">
      <text class="a">
        +
      </text>
    </view>
    <view v-if="noticeList.length > 0">
      <view class="notice-item" v-for="(item, index) in noticeList" :key="index" @tap="editNotice(item)">
        <view class="notice-item-main">
          <view class="day">
            <text class="date">{{ getLabelTime(item.noticeTime) }}</text>
            <text class="time">{{ getNoticeTime(item.noticeTime) }}</text>
          </view>
          <view class="remark">
            {{ item.remarks ? `${item.remarks},` : '' }}
            <text class="notice-day">
              {{ getNoticeDay(item.noticeDate) }}
            </text>
          </view>
        </view>
        <view class="notice-item-switch" @tap.stop="() => {}">
          <switch color="#43D95C" :checked="item.checked" @change="e => changeSwitch(e, item)"></switch>
        </view>
      </view>
    </view>
    <view class="empty" v-else>
      暂无数据
    </view>
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'
import Taro from '@tarojs/taro'
export default {
  components: {},
  data() {
    return {
      noticeList: [],
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  created() {
    this.$instance = Taro.getCurrentInstance()
  },
  onShow() {
    this.getOrderList()
  },
  mounted() {
    setTitle({ title: '下单提醒' })
  },
  methods: {
    getOrderList() {
      this.loading = true
      this.$API
        .getNoticeList()
        .then(data => {
          this.noticeList = (data || []).map(v => ({
            ...v,
            checked: v.statusFlag === 'NORMAL',
          }))
        })
        .finally(() => {
          this.loading = false
        })
    },
    getLabelTime(time) {
      time = time || ''
      const hours = Number(time.split(':')[0])
      return hours >= 12 ? '下午' : '上午'
    },
    getNoticeTime(time) {
      time = time || ''
      const [hours, minutes] = time.split(':')
      const hour = hours > 12 ? hours - 12 : hours - 0
      const min = Number(minutes)
      return `${'0' + hour}:${min > 9 ? min : '0' + min}`
    },
    getNoticeDay(date) {
      date = date || ''
      if (date === '0') return '永不'
      if (date?.split(',').length == 7) return '每天'
      const dayMap = {
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
        7: '周日',
      }

      return date
        .split(',')
        .map(day => dayMap[day])
        .join(' ')
    },
    changeSwitch(e, item) {
      item.checked = e.target.value
      this.$API
        .editNotice({
          noticeTime: item.noticeTime,
          noticeDate: item.noticeDate,
          oid: item.oid,
          statusFlag: item.checked ? 'NORMAL' : 'DISABLE',
        })
        .then(() => {
          console.log(111)
        })
    },
    addNotice() {
      Taro.navigateTo({ url: '/pages/order-notice/edit?type=add' })
    },
    editNotice(item) {
      Taro.navigateTo({ url: `/pages/order-notice/edit?type=edit&data=${JSON.stringify(item)}` })
    },
  },
}
</script>
