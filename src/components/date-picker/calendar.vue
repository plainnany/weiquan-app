<template>
  <view class="u-calendar">
    <view v-if="!insert && show" class="u-calendar__mask" :class="{ 'u-calendar--mask-show': aniMaskShow }" @tap="clean"></view>
    <view v-if="insert || show" class="u-calendar__content" :class="{ 'u-calendar--fixed': !insert, 'u-calendar--ani-show': aniMaskShow }">
      <view class="u-calendar__header">
        <view v-if="left" class="u-calendar__header-btn-box" @tap.stop="pre">
          <view class="u-calendar__header-btn u-calendar--left"></view>
        </view>
        <picker mode="date" :value="date" fields="month" @change="bindDateChange">
          <text class="u-calendar__header-text">{{ (nowDate.year || '') + '年' + (nowDate.month || '') + '月' }}</text>
        </picker>
        <view v-if="right" class="u-calendar__header-btn-box" @tap.stop="next">
          <view class="u-calendar__header-btn u-calendar--right"></view>
        </view>
      </view>
      <view class="u-calendar__box">
        <view v-if="showMonth" class="u-calendar__box-bg">
          <text class="u-calendar__box-bg-text">{{ nowDate.month }}</text>
        </view>
        <view class="u-calendar__weeks">
          <view class="u-calendar__weeks-day">
            <text class="u-calendar__weeks-day-text">日</text>
          </view>
          <view class="u-calendar__weeks-day">
            <text class="u-calendar__weeks-day-text">一</text>
          </view>
          <view class="u-calendar__weeks-day">
            <text class="u-calendar__weeks-day-text">二</text>
          </view>
          <view class="u-calendar__weeks-day">
            <text class="u-calendar__weeks-day-text">三</text>
          </view>
          <view class="u-calendar__weeks-day">
            <text class="u-calendar__weeks-day-text">四</text>
          </view>
          <view class="u-calendar__weeks-day">
            <text class="u-calendar__weeks-day-text">五</text>
          </view>
          <view class="u-calendar__weeks-day">
            <text class="u-calendar__weeks-day-text">六</text>
          </view>
        </view>
        <view class="u-calendar__weeks" v-for="(item, weekIndex) in weeks" :key="weekIndex">
          <view class="u-calendar__weeks-item" v-for="(weeks, weeksIndex) in item" :key="weeksIndex">
            <calendar-item
              class="u-calendar-item--hook"
              :weeks="weeks"
              :calendar="calendar"
              :selected="selected"
              :lunar="lunar"
              :checkHover="range"
              @change="choiceDate"
            />
          </view>
        </view>
      </view>
      <view v-if="!insert && !range && typeHasTime" class="u-date-changed u-calendar--fixed-top" style="padding: 0 40px;">
        <text class="u-date-changed--time-date">{{ tempSingleDate ? tempSingleDate : '选择日期' }}</text>
        <time-picker
          type="time"
          :start="reactStartTime"
          :end="reactEndTime"
          v-model="time"
          :disabled="!tempSingleDate"
          :border="false"
          class="time-picker-style"
        >
        </time-picker>
      </view>

      <view v-if="!insert && range && typeHasTime" class="u-date-changed u-calendar--fixed-top">
        <view class="u-date-changed--time-start">
          <text class="u-date-changed--time-date">{{ tempRange.before ? tempRange.before : '开始日期' }}</text>
          <time-picker
            type="time"
            :start="reactStartTime"
            v-model="timeRange.startTime"
            :border="false"
            :disabled="!tempRange.before"
            class="time-picker-style"
          >
          </time-picker>
        </view>
        <u-icons type="arrowthinright" color="#999" style="line-height: 50px;"></u-icons>
        <view class="u-date-changed--time-end">
          <text class="u-date-changed--time-date">{{ tempRange.after ? tempRange.after : '结束日期' }}</text>
          <time-picker
            type="time"
            :end="reactEndTime"
            v-model="timeRange.endTime"
            :border="false"
            :disabled="!tempRange.after"
            class="time-picker-style"
          >
          </time-picker>
        </view>
      </view>

      <view v-if="!insert" class="u-date-changed u-calendar__header" @tap="confirm">
        <!-- 				<view class="u-calendar__header-btn-box" @@tap="close">
					<text class="u-calendar__header-text u-calendar--fixed-width">取消</text>
				</view> -->
        <view class="u-calendar__header-btn-box">
          <text class="u-calendar__button-text u-calendar--fixed-width">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Calendar from './util.js'
import calendarItem from './calendar-item'
export default {
  components: { calendarItem },
  props: {
    date: {
      type: String,
      default: '',
    },
    defTime: {
      type: [String, Object],
      default: '',
    },
    selectableTimes: {
      type: [Object],
      default() {
        return {}
      },
    },
    selected: {
      type: Array,
      default() {
        return []
      },
    },
    lunar: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
    range: {
      type: Boolean,
      default: false,
    },
    typeHasTime: {
      type: Boolean,
      default: false,
    },
    insert: {
      type: Boolean,
      default: true,
    },
    showMonth: {
      type: Boolean,
      default: true,
    },
    clearDate: {
      type: Boolean,
      default: true,
    },
    left: {
      type: Boolean,
      default: true,
    },
    right: {
      type: Boolean,
      default: true,
    },
    checkHover: {
      type: Boolean,
      default: true,
    },
    pleStatus: {
      type: Object,
      default() {
        return {
          before: '',
          after: '',
          data: [],
          fulldate: '',
        }
      },
    },
  },
  data: () => ({
    show: false,
    weeks: [],
    calendar: {},
    nowDate: '',
    aniMaskShow: false,
    firstEnter: true,
    timeRange: {},
    time: '',
    tempRange: {
      before: '',
      after: '',
    },
    tempSingleDate: '',
  }),
  computed: {
    reactStartTime() {
      const activeDate = this.range ? this.tempRange.before : this.calendar.fullDate
      const res = activeDate === this.startDate ? this.selectableTimes.start : ''
      return res
    },
    reactEndTime() {
      const activeDate = this.range ? this.tempRange.after : this.calendar.fullDate
      const res = activeDate === this.endDate ? this.selectableTimes.end : ''
      return res
    },
  },
  created() {
    this.timeRange = {
      startTime: this.defTime.start ? this.defTime.start : '',
      endTime: this.defTime.end ? this.defTime.end : '',
    }
    this.time = this.defTime ? this.defTime : ''
    this.tempSingleDate = this.date
    // 获取日历方法实例
    this.cale = new Calendar({
      selected: this.selected,
      startDate: this.startDate,
      endDate: this.endDate,
      range: this.range,
    })
    this.init(this.date)
  },
  methods: {
    rangeWithinMonth(A, B) {
      const [yearA, monthA] = A.split('-')
      const [yearB, monthB] = B.split('-')
      return yearA === yearB && monthA === monthB
    },
    clean() {
      this.close()
    },
    bindDateChange(e) {
      const value = e.detail.value + '-1'
      console.log(this.cale.getDate(value))
      this.init(value)
    },
    init(date) {
      this.cale.setDate(date)
      this.weeks = this.cale.weeks
      this.nowDate = this.calendar = this.cale.getInfo(date)
    },
    open() {
      // 弹窗模式并且清理数据
      if (this.clearDate && !this.insert) {
        this.cale.cleanMultipleStatus()
        // this.cale.setDate(this.date)
        this.init(this.date)
      }
      this.show = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.aniMaskShow = true
        }, 50)
      })
    },
    close() {
      this.aniMaskShow = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.show = false
          this.$emit('close')
        }, 300)
      })
    },
    confirm() {
      this.setEmit('confirm')
      this.close()
    },
    change() {
      if (!this.insert) return
      this.setEmit('change')
    },
    monthSwitch() {
      let { year, month } = this.nowDate
      this.$emit('monthSwitch', {
        year,
        month: Number(month),
      })
    },
    setEmit(name) {
      let { year, month, date, fullDate, lunar, extraInfo } = this.calendar
      this.$emit(name, {
        range: this.cale.multipleStatus,
        year,
        month,
        date,
        time: this.time,
        timeRange: this.timeRange,
        fulldate: fullDate,
        lunar,
        extraInfo: extraInfo || {},
      })
    },
    choiceDate(weeks) {
      if (weeks.disable) return
      this.calendar = weeks
      // 设置多选
      this.cale.setMultiple(this.calendar.fullDate, true)
      this.weeks = this.cale.weeks
      this.tempSingleDate = this.calendar.fullDate
      this.tempRange.before = this.cale.multipleStatus.before
      this.tempRange.after = this.cale.multipleStatus.after
      this.change()
    },
    dateCompare(startDate, endDate) {
      // 计算截止时间
      startDate = new Date(startDate.replace('-', '/').replace('-', '/'))
      // 计算详细项的截止时间
      endDate = new Date(endDate.replace('-', '/').replace('-', '/'))
      if (startDate <= endDate) {
        return true
      } else {
        return false
      }
    },
    pre() {
      const preDate = this.cale.getDate(this.nowDate.fullDate, -1, 'month').fullDate
      this.setDate(preDate)
      this.monthSwitch()
    },
    next() {
      const nextDate = this.cale.getDate(this.nowDate.fullDate, +1, 'month').fullDate
      this.setDate(nextDate)
      this.monthSwitch()
    },
    setDate(date) {
      this.cale.setDate(date)
      this.weeks = this.cale.weeks
      this.nowDate = this.cale.getInfo(date)
    },
  },
  watch: {
    date(newVal, oldVal) {
      // this.cale.setDate(newVal)
      this.init(newVal)
    },
    startDate(val) {
      this.cale.resetSatrtDate(val)
    },
    endDate(val) {
      this.cale.resetEndDate(val)
    },
    selected(newVal) {
      this.cale.setSelectInfo(this.nowDate.fullDate, newVal)
      this.weeks = this.cale.weeks
    },
    pleStatus: {
      immediate: true,
      handler(newVal, oldVal) {
        const { before, after, fulldate, which } = newVal
        this.tempRange.before = before
        this.tempRange.after = after
        setTimeout(() => {
          if (fulldate) {
            this.cale.setHoverMultiple(fulldate)
            if (before && after) {
              this.cale.lastHover = true
              if (this.rangeWithinMonth(after, before)) return
              this.setDate(before)
            }
            if (!before && !after) {
              this.cale.setMultiple(fulldate)
              this.setDate(this.nowDate.fullDate)
              this.calendar.fullDate = ''
              this.cale.lastHover = false
            }
          } else {
            this.cale.setDefaultMultiple(before, after)
            if (which === 'left') {
              this.setDate(before)
            } else {
              this.setDate(after)
            }
            this.cale.lastHover = true
          }
        }, 16)
      },
    },
  },
}
</script>

<style lang="scss">
.u-calendar {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
}

.u-calendar__mask {
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  transition-property: opacity;
  transition-duration: 0.3s;
  opacity: 0;
  /* #ifndef APP-NVUE */
  z-index: 99;
  /* #endif */
}

.u-calendar--mask-show {
  opacity: 1;
}

.u-calendar--fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  transition-property: transform;
  transition-duration: 0.3s;
  transform: translateY(460px);
  /* #ifndef APP-NVUE */
  z-index: 99;
  /* #endif */
}

.u-calendar--ani-show {
  transform: translateY(0);
}

.u-calendar__content {
  background-color: #fff;
}

.u-calendar__header {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.u-calendar--fixed-top {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: space-between;
  border-top-color: #f2f2f2;
  border-top-style: solid;
  border-top-width: 1px;
}

.u-calendar--fixed-width {
  width: 50px;
  // padding: 0 15px;
}

.u-calendar__backtoday {
  position: absolute;
  right: 0;
  top: 25rpx;
  padding: 0 5px;
  padding-left: 10px;
  height: 25px;
  line-height: 25px;
  font-size: 12px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  color: #37383d;
  background-color: #7a7a7a;
}

.u-calendar__header-text {
  text-align: center;
  width: 100px;
  font-size: 32px;
  color: #37383d;
}

.u-calendar__button-text {
  text-align: center;
  width: 100px;
  font-size: 32px;
  color: #ff9047;
  letter-spacing: 3px;
}

.u-calendar__header-btn-box {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 50px;
}

.u-calendar__header-btn {
  width: 10px;
  height: 10px;
  border-left-color: #37383d;
  border-left-style: solid;
  border-left-width: 2px;
  border-top-color: #37383d;
  border-top-style: solid;
  border-top-width: 2px;
}

.u-calendar--left {
  transform: rotate(-45deg);
}

.u-calendar--right {
  transform: rotate(135deg);
}

.u-calendar__weeks {
  position: relative;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}

.u-calendar__weeks-item {
  flex: 1;
}

.u-calendar__weeks-day {
  flex: 1;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 45px;
  border-bottom-color: #f5f5f5;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

.u-calendar__weeks-day-text {
  font-size: 32px;
}

.u-calendar__box {
  position: relative;
}

.u-calendar__box-bg {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.u-calendar__box-bg-text {
  font-size: 200px;
  font-weight: bold;
  color: #7a7a7a;
  opacity: 0.1;
  text-align: center;
  /* #ifndef APP-NVUE */
  line-height: 1;
  /* #endif */
}

.u-date-changed {
  padding: 0 10px;
  // line-height: 50px;
  text-align: center;
  color: #333;
  border-top-color: #f2f2f2;
  border-top-style: solid;
  border-top-width: 1px;
}

.u-date-changed--time text {
  // padding: 0 20px;
  // height: 50px;
  line-height: 50px;
}

.u-date-changed {
  flex: 1;
}

.u-date-changed--time {
  display: flex;
  flex: 1;
}

.u-date-changed--time-start {
  display: flex;
  justify-content: right;
  align-items: center;
  // flex: 1;
}

.u-date-changed--time-end {
  display: flex;
  justify-content: left;
  align-items: center;
  // flex: 1;
}

.u-date-changed--time-date {
  color: #999;
  line-height: 50px;
  // opacity: 0.6;
}

.time-picker-style {
  width: 62px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mr-10 {
  margin-right: 10px;
}
</style>
