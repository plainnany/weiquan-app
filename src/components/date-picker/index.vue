<template>
  <view class="u-date">
    <view v-if="$slots.default" @tap="show">
      <slot></slot>
    </view>
    <view
      v-else
      class="u-date-editor--x"
      :class="{
        'u-date-editor--x__disabled': disabled,
      }"
    >
      <view v-if="!isRange" class="u-date-x u-date-single" @tap="show">
        <view class="u-date__icon-logo">
          <image class="u-date-editor--logo" :src="dateIcon" mode=""></image>
        </view>
        <input class="u-date__input" type="text" v-model="singleVal" :placeholder="placeholder" :disabled="true" />
      </view>
      <view v-else class="u-date-x u-date-range" @tap="show">
        <!-- <view class="u-date__icon-logo"> -->
        <image class="u-date-editor--logo" :src="dateIcon" mode=""></image>
        <!-- </view> -->
        <input
          class="u-date__input u-date-range__input"
          type="text"
          v-model="range.startDate"
          :placeholder="startPlaceholder"
          :disabled="true"
        />
        <slot>
          <view class="">{{ rangeSeparator }}</view>
        </slot>
        <input
          class="u-date__input u-date-range__input"
          type="text"
          v-model="range.endDate"
          :placeholder="endPlaceholder"
          :disabled="true"
        />
      </view>
      <view v-show="!disabled && (singleVal || (range.startDate && range.endDate))" class="u-date__icon-clear" @tap="clear">
        <!--				<u-icons type="clear" color="#e1e1e1" size="14"></u-icons>-->
      </view>
    </view>
    <view v-show="popup" class="u-date-mask" @tap="close"></view>
    <view ref="datePicker" v-show="popup" class="u-date-picker__container">
      <view v-if="!isRange" class="u-date-single--x" :style="popover">
        <view v-show="hasTime" class="u-date-changed popup-x-header">
          <input class="u-date__input u-date-range__input" type="text" v-model="tempSingleDate" placeholder="选择日期" />
          <time-picker type="time" v-model="time" :border="false" :disabled="!tempSingleDate" :start="reactStartTime" :end="reactEndTime">
            <input
              class="u-date__input u-date-range__input"
              type="text"
              v-model="time"
              placeholder="选择时间"
              :disabled="!tempSingleDate"
            />
          </time-picker>
        </view>
        <calendar
          ref="pcSingle"
          :showMonth="false"
          :start-date="caleRange.startDate"
          :end-date="caleRange.endDate"
          :date="defSingleDate"
          @change="singleChange"
        />
        <view v-if="hasTime" class="popup-x-footer">
          <!-- <text class="">此刻</text> -->
          <text class="confirm" @tap="confirmSingleChange">确定</text>
        </view>
        <view class="u-date-popper__arrow"></view>
      </view>

      <view v-else class="u-date-range--x" :style="popover">
        <view v-show="hasTime" class="popup-x-header u-date-changed">
          <view class="popup-x-header--datetime">
            <input class="u-date__input u-date-range__input" type="text" v-model="tempRange.startDate" placeholder="开始日期" />
            <time-picker type="time" v-model="tempRange.startTime" :start="reactStartTime" :border="false" :disabled="!tempRange.startDate">
              <input
                class="u-date__input u-date-range__input"
                type="text"
                v-model="tempRange.startTime"
                placeholder="开始时间"
                :disabled="!tempRange.startDate"
              />
            </time-picker>
          </view>
          <!--					<u-icons type="arrowthinright" color="#999" style="line-height: 40px;"></u-icons>-->
          <view class="popup-x-header--datetime">
            <input class="u-date__input u-date-range__input" type="text" v-model="tempRange.endDate" placeholder="结束日期" />
            <time-picker type="time" v-model="tempRange.endTime" :end="reactEndTime" :border="false" :disabled="!tempRange.endDate">
              <input
                class="u-date__input u-date-range__input"
                type="text"
                v-model="tempRange.endTime"
                placeholder="结束时间"
                :disabled="!tempRange.endDate"
              />
            </time-picker>
          </view>
        </view>
        <view class="popup-x-body">
          <calendar
            ref="left"
            :showMonth="false"
            :start-date="caleRange.startDate"
            :end-date="caleRange.endDate"
            :range="true"
            @change="leftChange"
            :pleStatus="endMultipleStatus"
            @firstEnterCale="updateRightCale"
            @monthSwitch="leftMonthSwitch"
            style="padding-right: 16px;"
          />
          <calendar
            ref="right"
            :showMonth="false"
            :start-date="caleRange.startDate"
            :end-date="caleRange.endDate"
            :range="true"
            @change="rightChange"
            :pleStatus="startMultipleStatus"
            @firstEnterCale="updateLeftCale"
            @monthSwitch="rightMonthSwitch"
            style="padding-left: 16px;border-left: 1px solid #F1F1F1;"
          />
        </view>
        <view v-if="hasTime" class="popup-x-footer">
          <text class="" @tap="clear">清空</text>
          <text class="confirm" @tap="confirmRangeChange">确定</text>
        </view>
      </view>
    </view>
    <calendar
      ref="mobile"
      :clearDate="false"
      :date="defSingleDate"
      :defTime="reactMobDefTime"
      :start-date="caleRange.startDate"
      :end-date="caleRange.endDate"
      :selectableTimes="mobSelectableTime"
      :pleStatus="endMultipleStatus"
      :showMonth="false"
      :range="isRange"
      :typeHasTime="hasTime"
      :insert="false"
      @confirm="mobileChange"
    />
  </view>
</template>

<script>
import calendar from './calendar.vue'
import dateIcon from '@/images/date.png'
// import { getSystemInfoSync } from '@/utils'

export default {
  name: 'uDatetimePicker',
  components: {
    calendar,
  },
  props: {
    type: {
      type: String,
      default: 'datetime',
    },
    value: {
      type: [String, Number, Array],
      default: '',
    },
    start: {
      type: [Number, String],
      default: '',
    },
    end: {
      type: [Number, String],
      default: '',
    },
    returnType: {
      type: String,
      default: 'string',
    },
    placeholder: {
      type: String,
      default: '选择日期',
    },
    startPlaceholder: {
      type: String,
      default: '起始日期',
    },
    endPlaceholder: {
      type: String,
      default: '结束日期',
    },
    rangeSeparator: {
      type: String,
      default: '-',
    },
    disabled: {
      type: [Boolean],
      default: false,
    },
  },
  data: () => ({
    isRange: false,
    hasTime: false,
    mobileRange: false,
    // 单选
    singleVal: '',
    tempSingleDate: '',
    defSingleDate: '',
    time: '',
    // 范围选
    caleRange: {
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    },
    range: {
      startDate: '',
      // startTime: '',
      endDate: '',
      // endTime: ''
    },
    tempRange: {
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    },
    // 左右日历同步数据
    startMultipleStatus: {
      before: '',
      after: '',
      data: [],
      fulldate: '',
    },
    endMultipleStatus: {
      before: '',
      after: '',
      data: [],
      fulldate: '',
    },
    visible: false,
    popup: false,
    popover: null,
    dateIcon,
  }),
  computed: {
    reactStartTime() {
      const activeDate = this.isRange ? this.tempRange.startDate : this.tempSingleDate
      const res = activeDate === this.caleRange.startDate ? this.caleRange.startTime : ''
      return res
    },
    reactEndTime() {
      const activeDate = this.isRange ? this.tempRange.endDate : this.tempSingleDate
      const res = activeDate === this.caleRange.endDate ? this.caleRange.endTime : ''
      return res
    },
    reactMobDefTime() {
      return this.isRange
        ? {
            start: this.tempRange.startTime,
            end: this.tempRange.endTime,
          }
        : this.time
    },
    mobSelectableTime() {
      return {
        start: this.caleRange.startTime,
        end: this.caleRange.endTime,
      }
    },
  },
  mounted() {
    if (this.isRange) {
      if (!Array.isArray(this.value)) return
      const [before, after] = this.value
      if (before && after) return
      setTimeout(() => {
        this.$refs.right.next()
        this.$refs.right.cale.lastHover = false
      }, 20)
    }
  },
  methods: {
    setEmit(value) {
      if (this.returnType === 'timestamp') {
        if (!Array.isArray(value)) {
          if (!this.hasTime) {
            value = value + ' ' + '00:00:00'
          }
          value = this.createTimestamp(value)
        } else {
          if (!this.hasTime) {
            value[0] = value[0] + ' ' + '00:00:00'
            value[1] = value[1] + ' ' + '00:00:00'
          }
          value[0] = this.createTimestamp(value[0])
          value[1] = this.createTimestamp(value[1])
        }
      }
      this.$emit('change', value)
      this.$emit('input', value)
    },
    createTimestamp(date) {
      date = this.fixIosDateFormat(date)
      return Date.parse(new Date(date))
    },
    fixIosDateFormat(value) {
      if (typeof value === 'string') {
        value = value.replace(/-/g, '/')
      }
      return value
    },
    leftChange(e) {
      const { before, after } = e.range
      this.rangeChange(before, after)
      const obj = {
        before: e.range.before,
        after: e.range.after,
        data: e.range.data,
        fulldate: e.fulldate,
      }
      this.startMultipleStatus = Object.assign({}, this.startMultipleStatus, obj)
      // console.log('startMultipleStatus 返回:', this.startMultipleStatus)
    },
    rightChange(e) {
      const { before, after } = e.range
      this.rangeChange(before, after)
      const obj = {
        before: e.range.before,
        after: e.range.after,
        data: e.range.data,
        fulldate: e.fulldate,
      }
      this.endMultipleStatus = Object.assign({}, this.endMultipleStatus, obj)
      // console.log('endMultipleStatus 返回:', this.endMultipleStatus)
    },
    rangeChange(before, after) {
      if (!(before && after)) return
      this.handleStartAndEnd(before, after, true)
      if (this.hasTime) return
      this.confirmRangeChange()
    },
    confirmRangeChange() {
      if (!this.tempRange.startDate && !this.tempRange.endDate) {
        this.popup = false
        return
      }
      let start, end
      if (!this.hasTime) {
        start = this.range.startDate = this.tempRange.startDate
        end = this.range.endDate = this.tempRange.endDate
      } else {
        start = this.range.startDate = this.tempRange.startDate + ' ' + (this.tempRange.startTime ? this.tempRange.startTime : '00:00:00')
        end = this.range.endDate = this.tempRange.endDate + ' ' + (this.tempRange.endTime ? this.tempRange.endTime : '00:00:00')
      }
      const displayRange = [start, end]
      this.setEmit(displayRange)
      this.popup = false
    },
    handleStartAndEnd(before, after, temp = false) {
      if (!(before && after)) return
      const type = temp ? 'tempRange' : 'range'
      if (this.dateCompare(before, after)) {
        this[type].startDate = before
        this[type].endDate = after
      } else {
        this[type].startDate = after
        this[type].endDate = before
      }
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
    show() {
      if (this.disabled) {
        return
      }
      this.$refs.mobile.open()

      // const systemInfo = getSystemInfoSync()
      // if (systemInfo.windowWidth <= 500) {
      //   this.$refs.mobile.open()
      //   return
      // }
      // this.popover = {
      //   top: '10px',
      // }

      // setTimeout(() => {
      //   this.popup = !this.popup
      // }, 20)
    },
    close() {
      setTimeout(() => {
        this.popup = false
      }, 20)
    },
    clear() {
      if (!this.isRange) {
        this.singleVal = ''
        this.$refs.pcSingle.calendar.fullDate = ''
        this.$refs.pcSingle.setDate()
        this.$emit('change', '')
        this.$emit('input', '')
      } else {
        this.range.startDate = ''
        this.range.endDate = ''
        this.tempRange = {}
        this.$refs.left.cale.multipleStatus.before = ''
        this.$refs.left.cale.multipleStatus.after = ''
        this.$refs.left.cale.multipleStatus.data = []
        this.$refs.left.cale.lastHover = false
        this.$refs.left.setDate()
        this.$refs.right.cale.multipleStatus.before = ''
        this.$refs.right.cale.multipleStatus.after = ''
        this.$refs.right.cale.multipleStatus.data = []
        this.$refs.right.cale.lastHover = false
        this.$refs.right.setDate()
        this.$refs.right.next()
        this.$emit('change', ['', ''])
        this.$emit('input', ['', ''])
      }
    },
    updateRightCale(e) {
      // console.log('----updateStartCale:', e);
      const right = this.$refs.right
      // 设置范围选
      right.cale.setHoverMultiple(e.after)
      right.setDate(this.$refs.right.nowDate.fullDate)
    },
    leftMonthSwitch(e) {
      // console.log('leftMonthSwitch 返回:', e)
    },
    rightMonthSwitch(e) {
      // console.log('rightMonthSwitch 返回:', e)
    },
    updateLeftCale(e) {
      // console.log('----updateStartCale:', e);
      const left = this.$refs.left
      // 设置范围选
      left.cale.setHoverMultiple(e.after)
      left.setDate(this.$refs.left.nowDate.fullDate)
    },
    singleChange(e) {
      this.tempSingleDate = e.fulldate
      if (this.hasTime) return
      this.confirmSingleChange()
    },
    confirmSingleChange() {
      if (!this.tempSingleDate) {
        this.popup = false
        return
      }
      if (this.hasTime) {
        this.singleVal = this.tempSingleDate + ' ' + (this.time ? this.time : '00:00:00')
      } else {
        this.singleVal = this.tempSingleDate
      }
      this.setEmit(this.singleVal)
      this.popup = false
    },
    mobileChange(e) {
      if (this.isRange) {
        const { before, after } = e.range
        this.handleStartAndEnd(before, after, true)
        if (this.hasTime) {
          const { startTime, endTime } = e.timeRange
          this.tempRange.startTime = startTime
          this.tempRange.endTime = endTime
        }
        this.confirmRangeChange()
      } else {
        if (this.hasTime) {
          this.singleVal = e.fulldate + ' ' + e.time
        } else {
          this.singleVal = e.fulldate
        }
        this.setEmit(this.singleVal)
      }
      this.$refs.mobile.close()
    },
    parseDate(date) {
      date = this.fixIosDateFormat(date)
      const defVal = new Date(date)
      const year = defVal.getFullYear()
      const month = defVal.getMonth() + 1
      const day = defVal.getDate()
      const hour = defVal.getHours()
      const minute = defVal.getMinutes()
      const second = defVal.getSeconds()
      const defDate = year + '-' + this.lessTen(month) + '-' + this.lessTen(day)
      const defTime = this.lessTen(hour) + ':' + this.lessTen(minute) + ':' + this.lessTen(second)
      return {
        defDate,
        defTime,
      }
    },
    lessTen(item) {
      return item < 10 ? '0' + item : item
    },
  },
  watch: {
    type: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal.indexOf('time') !== -1) {
          this.hasTime = true
        }
        if (newVal.indexOf('range') !== -1) {
          this.isRange = true
        } else {
          this.isRange = false
        }
      },
    },
    value: {
      immediate: true,
      handler(newVal, oldVal) {
        if (!newVal) return
        if (!Array.isArray(newVal) && !this.isRange) {
          const { defDate, defTime } = this.parseDate(newVal)
          this.singleVal = defDate
          this.tempSingleDate = defDate
          this.defSingleDate = defDate
          if (this.hasTime) {
            this.singleVal = defDate + ' ' + defTime
            this.time = defTime
          }
        } else {
          if (oldVal) return // 只初始默认值
          const [before, after] = newVal
          if (!before && !after) return
          const defBefore = this.parseDate(before)
          const defAfter = this.parseDate(after)
          this.range.startDate = this.tempRange.startDate = defBefore.defDate
          this.range.endDate = this.tempRange.endDate = defAfter.defDate

          if (this.hasTime) {
            this.range.startDate = defBefore.defDate + ' ' + defBefore.defTime
            this.range.endDate = defAfter.defDate + ' ' + defAfter.defTime
            this.tempRange.startTime = defBefore.defTime
            this.tempRange.endTime = defAfter.defTime
          }
          const defaultRange = {
            before: defBefore.defDate,
            after: defAfter.defDate,
          }
          this.startMultipleStatus = Object.assign({}, this.startMultipleStatus, defaultRange, {
            which: 'right',
          })
          this.endMultipleStatus = Object.assign({}, this.endMultipleStatus, defaultRange, {
            which: 'left',
          })
        }
      },
    },
    start: {
      immediate: true,
      handler(newVal, oldVal) {
        if (!newVal) return
        const { defDate, defTime } = this.parseDate(newVal)
        this.caleRange.startDate = defDate
        if (this.hasTime) {
          this.caleRange.startTime = defTime
        }
      },
    },
    end: {
      immediate: true,
      handler(newVal, oldVal) {
        if (!newVal) return
        const { defDate, defTime } = this.parseDate(newVal)
        this.caleRange.endDate = defDate
        if (this.hasTime) {
          this.caleRange.endTime = defTime
        }
      },
    },
  },
}
</script>

<style lang="scss">
.u-date-x {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: #fff;
  color: #666;
  font-size: 28px;
}

.u-date-editor--x {
  position: relative;
}

.u-date-editor--x:hover .u-date__icon-clear {
  position: absolute;
  top: 5px;
  right: 0;
  display: inline-block;
  box-sizing: border-box;
  border: 6px solid transparent;
  margin-right: 6px;
}

.u-date__icon-clear {
  display: none;
}

.u-date__input {
  height: 40px;
  width: 100%;
  padding: 0 28px;
  line-height: 40px;
  font-size: 28px;
}

.u-date-range__input {
  text-align: center;
}

.u-date-picker__container {
  position: relative;
}

.u-date-mask {
  position: fixed;
  bottom: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0);
  transition-duration: 0.3s;
  z-index: 996;
}

.u-date-single--x {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
}

.u-date-range--x {
  padding: 0 8px;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
}

.u-date-editor--x__disabled {
  opacity: 0.4;
  cursor: default;
}

.u-date-editor--logo {
  width: 32px;
  height: 32px;
  margin-top: 4px;
}

/* 添加时间 */
.popup-x-header {
  flex-direction: row;
}

.popup-x-header--datetime {
  flex-direction: row;
  flex: 1;
}

.popup-x-body {
  display: flex;
}

.popup-x-footer {
  box-sizing: border-box;
  padding: 15px;
  border: 1px solid #f1f1f1;
  background-color: #fff;
  line-height: 40px;
  text-align: right;
  color: #666;
}

.popup-x-footer .confirm {
  margin-left: 20px;
  color: #ff8e49;
}

.u-date-changed {
  background-color: #fff;
  text-align: center;
  color: #333;
  border-bottom-color: #f1f1f1;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  /* padding: 0 50px; */
}

.u-date-changed--time text {
  /* padding: 0 20px; */
  height: 50px;
  line-height: 50px;
}

.u-date-changed .u-date-changed--time {
  /* display: flex; */
  flex: 1;
}

.u-date-changed--time-date {
  color: #333;
  opacity: 0.6;
}

.mr-50 {
  margin-right: 50px;
}
</style>
