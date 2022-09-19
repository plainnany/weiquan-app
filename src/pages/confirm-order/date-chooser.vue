<template>
  <view class="date-chooser">
    <view class="weeks">
      <view class="week-item" v-for="item in weeks" :key="item.day">{{ item.text }}</view>
    </view>
    <view v-for="(item, index) in dateList" :key="index">
      <view class="month">{{ item.monthStr }} {{ item.year }}</view>
      <view class="date-row" v-for="round in parseInt(item.day.length / 7)" :key="round">
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
    <view class="footer">
      <nan-button @tap="() => $emit('cancel')">取消</nan-button>
      <nan-button type="primary" @tap="onConfirm">完成</nan-button>
    </view>
  </view>
</template>

<script>
import './date-chooser.less'

export default {
  props: {
    productCode: String,
    isBatchOrder: Boolean, // 是否是批量下单，批量下单的情况下，日期可以多选
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
    }
  },
  computed: {},
  mounted() {
    this.$API
      .dateChooser({
        productCode: this.productCode,
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
              if (this.isBatchOrder) {
                this.chosenDates.push(checkedData)
              } else {
                this.chosenDate = checkedData
              }
            } else {
              this.chosenDate = null
              this.chosenDates = this.chosenDates.filter(v => !(v.day === item.day && v.month === itemData.month))
            }
          } else {
            if (!this.isBatchOrder) {
              item.checked = false
            }
          }
        })
      })
    },
    formatDate(dateList) {
      const firstDate = dateList[0]
      const lastDate = dateList[dateList.length - 1]
      const preAppend = Array(8 - this.weekMap[firstDate.week])
        .fill(1)
        .map(() => ({
          week: '',
          flg: false,
          day: '',
        }))
      const lastAppend = Array(6 - this.weekMap[lastDate.week])
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
    onConfirm() {
      let query = ''
      if (this.isBatchOrder) {
        query = this.chosenDates.map(v => `${v.year}-${v.month}-${v.day}`).join(',')
      } else {
        query = `${this.chosenDate.year}-${this.chosenDate.month}-${this.chosenDate.day}`
      }
      if (query) {
        this.$emit('confirm', query)
      }
    },
  },
}
</script>
