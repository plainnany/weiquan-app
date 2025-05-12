<template>
  <view class="date-chooser">
    <!-- <view class="header" @tap="onConfirm">完成</view> -->
    <view class="date-chooser-scroll">
      <view class="date-chooser-container">
        <view class="weeks">
          <view class="week-item" v-for="item in weeks" :key="item.day">{{ item.text }}</view>
        </view>
        <view v-for="(item, index) in dateList" :key="index" class="date-wrapper">
          <view class="month">{{ item.monthStr }} {{ item.year }}</view>
          <view class="date-row" v-for="round in Math.ceil(item.day.length / 7)" :key="round">
            <view
              class="date-col"
              v-for="index in 7"
              @tap="chooseDate(getDay(item.day, round, index), item)"
              :key="index"
              :class="{ disabled: !getDay(item.day, round, index).flg, checked: getDay(item.day, round, index).checked }"
              >{{ getDay(item.day, round, index).day }}</view
            >
          </view>
        </view>
      </view>
    </view>

    <view class="footer">
      <nan-button @tap="cancel">取消</nan-button>
      <nan-button type="primary" @tap="confirm">确定修改</nan-button>
    </view>
  </view>
</template>

<script>
import './date-chooser.less'
import Taro from '@tarojs/taro'
import { setTitle, qs } from '@/utils'

export default {
  name: 'date-chooser',
  props: {
    order: {
      type: Object,
    },
  },
  components: {},
  data() {
    return {
      weeks: [
        {
          text: '日',
          day: 7,
        },
        {
          text: '一',
          day: 1,
        },
        {
          text: '二',
          day: 2,
        },
        {
          text: '三',
          day: 3,
        },
        {
          text: '四',
          day: 4,
        },
        {
          text: '五',
          day: 5,
        },
        {
          text: '六',
          day: 6,
        },
      ],
      dateList: [],
      chosenDate: null,
      chosenDates: [],
      weekMap: {
        周一: 1,
        周二: 2,
        周三: 3,
        周四: 4,
        周五: 5,
        周六: 6,
        周日: 7,
      },
      isBatchOrder: '',
    }
  },
  computed: {},
  onShow() {},
  mounted() {
    this.$API
      .dateChooser({
        productCode: this.order?.orderViews[0]?.productCode,
        type: '',
      })
      .then(data => {
        this.dateList = data.map(v => ({
          ...v,
          day: this.formatDate(v.day),
        }))
      })
  },
  methods: {
    chooseDate(date, itemData) {
      // 如果是批量下单，日期可以多选
      if (!date.flg) return
      this.dateList.forEach(v => {
        v.day.forEach(item => {
          if (date.day === item.day && itemData.month === v.month) {
            item.checked = !item.checked
            const checkedData = {
              ...item,
              month: itemData.month,
              year: itemData.year,
            }
            if (item.checked) {
              this.chosenDate = checkedData
            } else {
              this.chosenDate = null
            }
          } else {
            item.checked = false
          }
        })
      })
    },
    formatDate(dateList) {
      const firstDate = dateList[0]
      const lastDate = dateList[dateList.length - 1]
      const preAppend = Array(this.weekMap[firstDate.week])
        .fill(1)
        .map(() => ({
          week: '',
          flg: false,
          day: '',
        }))
      const lastAppend = Array(Math.abs(6 - this.weekMap[lastDate.week]))
        .fill(1)
        .map(() => ({
          week: '',
          flg: false,
          day: '',
        }))
      const result = preAppend
        .concat(dateList)
        .concat(lastAppend)
        .map(v => ({
          ...v,
          checked: false,
        }))
      return result
    },
    getDay(days, round, index) {
      return days[(round - 1) * 7 + index - 1] || {}
    },
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      const date = this.chosenDate?.weekStr.split(' ')[0]
      if (!date) {
        return Taro.showToast({
          title: '请选择时间',
          icon: 'error',
        })
      }
      this.$emit('confirm', date)
    },
    onConfirm() {
      let query = ''
      let weekStr = ''
      if (this.isBatchOrder) {
        // query = this.chosenDates.map(v => `${v.year}-${v.month}-${v.day}`).join(',')
        query = this.chosenDates
      } else {
        if (this.chosenDate) {
          query = [this.chosenDate]
        }
      }
      if (query) {
        const deliverTime = query.map(v => v.weekStr)
        const pages = Taro.getCurrentPages()
        const prevPage = pages[pages.length - 1]
        const deliverArr = [
          {
            productCode: this.productCode,
            deliverTime,
          },
        ]
        const preDeliverArr = this.$store.state.deliverTime.filter(v => v.productCode !== this.productCode)
        const deliverList = preDeliverArr.concat(deliverArr)
        this.$store.commit('setDeliverTime', deliverList)
        Taro.navigateBack({
          delta: 1,
          success: res => {
            // this.$store.commit('setDeliverTime', deliverList)
            // 不知道为啥不生效，扔到store中处理了
            // prevPage.setData({
            //   deliverTime2: '122',
            // })
          },
        })
      } else {
        Taro.showToast({
          title: '请选择配送时间',
          icon: 'error',
        })
      }
    },
  },
}
</script>
