<template>
  <view class="order-notice-edit">
    <view class="action">
      <view class="action-item" @tap="goBack">取消</view>
      <view class="action-item" @tap="handleSave">储存</view>
    </view>
    <view class="header">设置时间</view>
    <view class="main">
      <view class="set-time">
        <view>
          <view>请输入时间</view>
          <view class="time-detail">
            <view class="hour">
              <input :placeholder="3" v-model="hour" />
              <view>点</view>
            </view>
            <view>:</view>
            <view class="min">
              <input :placeholder="3" v-model="min" />
              <view>分</view>
            </view>
          </view>
        </view>
        <view class="time-type">
          <!-- {{ timeType }}
          <image class="arrow" :src="backImg"></image> -->

          <picker mode="selector" :range="timeTypes" @change="timeTypeChange" range-key="label">
            <text>{{ timeTypes[timeTypeIndex].label }}</text>
            <image class="arrow" :src="backImg"></image>
          </picker>
        </view>
      </view>
      <view class="card">
        <view class="card-item">重复</view>
        <view class="card-item grey" @tap="handleDate"> {{ repeatDate }} <image :src="backImg" mode="" /> </view>
      </view>
      <view class="card">
        <view class="card-item">标签</view>
        <view class="card-item grey"
          >下单提醒
          <!-- <image :src="backImg" mode=""/> -->
        </view>
      </view>
    </view>

    <view class="footer" @tap="deleteNotice">删除下单提醒</view>
    <nan-modal :visible="dateChooseVisible" v-if="dateChooseVisible" fullScreen>
      <view class="week">
        <view class="week-action">
          <view @tap="cancelChooseWeek">取消</view>
          <view @tap="chooseWeek"> 保存</view>
        </view>
        <view class="week-item" v-for="(item, index) in weeks" :key="index" @tap="handleCheck(item)">
          <view class="label">{{ item.label }}</view>
          <view class="check" v-if="item.checked">
            <image :src="checkedImg" mode="" class="checked" />
          </view>
        </view>
      </view>
    </nan-modal>
  </view>
</template>
<script>
import { setTitle } from '@/utils'
import Taro from '@tarojs/taro'
import backImg from '@/images/user/back.png'
import checkedImg from '@/images/checked.svg'

const weekMap = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日',
}

export default {
  data() {
    return {
      backImg,
      checkedImg,
      hour: '', // 时
      min: '', // 分
      timeType: '上午',
      timeTypes: [
        {
          label: '上午',
          type: '01',
        },
        {
          label: '下午',
          type: '02',
        },
      ],
      timeTypeIndex: 0,
      repeatDate: '永不',
      noticeData: {},
      dateChooseVisible: false,
      weeks: Object.keys(weekMap).map(key => ({
        label: weekMap[key],
        value: key,
        checked: false,
      })),
    }
  },
  created() {
    this.$instance = Taro.getCurrentInstance()
  },
  mounted() {
    setTitle({ title: '下单提醒' })
    const params = this.$instance.router.params
    const { type, data } = params
    this.editType = type

    const defaultDate = new Date()
    let minutes = defaultDate.getMinutes()
    let hours = defaultDate.getHours()
    minutes = minutes > 10 ? minutes : '0' + minutes
    hours = hours > 10 ? hours : '0' + hours

    if (data) {
      this.noticeData = JSON.parse(data) || {}

      const { noticeTime, noticeDate } = this.noticeData
      const [hour, min] = noticeTime.split(':')
      this.hour = hour
      this.min = min
      this.repeatDate = this.getNoticeDay(noticeDate)
    } else {
      this.hour = hours
      this.min = minutes
    }

    if (Number(this.hour) >= 12) {
      this.timeTypeIndex = 1
    }
  },
  methods: {
    handleDate() {
      this.dateChooseVisible = true
    },
    getNoticeDay(date) {
      if (date === '0') return '永不'
      const dateArr = date.split(',')
      if (dateArr.length == 7) return '每天'

      this.weeks.forEach(item => {
        item.checked = dateArr.some(day => Number(item.value) === Number(day))
      })
      return date
        .split(',')
        .map(day => {
          return weekMap[day]
        })
        .join(' ')
    },
    timeTypeChange(e) {
      this.timeTypeIndex = parseInt(e.detail.value)
    },
    goBack() {
      Taro.navigateTo({ url: '/pages/order-notice/index' })
    },
    handleCheck(item) {
      item.checked = !item.checked
    },
    cancelChooseWeek() {
      this.dateChooseVisible = false
    },
    chooseWeek() {
      const noticeDate = this.weeks.filter(v => v.checked)
      this.repeatDate = noticeDate.map(v => v.label).join(' ')
      this.dateChooseVisible = false
    },
    deleteNotice() {
      this.$API
        .deleteNotice({
          noticeOid: this.noticeData.oid,
        })
        .then(() => this.goBack())
    },
    handleSave() {
      const params = {
        noticeTime: this.hour + ':' + this.min,
        noticeDate: this.weeks
          .filter(v => v.checked)
          .map(v => v.value)
          .join(','),
      }

      if (this.editType === 'add') {
      } else if (this.editType === 'edit') {
        params.oid = this.noticeData.oid
      }

      this.$API.editNotice(params).then(() => {
        this.goBack()
      })
    },
  },
}
</script>

<style lang="less">
.order-notice-edit {
  height: 100%;
  background: #eff1f0;

  .header {
    background: #ce7a4e;
    padding: 48px 36px;
    font-size: 48px;
    color: #fff;
  }

  .main {
    background: #fff;
  }

  .footer {
    text-align: center;
    padding: 24px 0;
    margin-top: 32px;
    background: #fff;
    color: #c87956;
  }

  .arrow {
    width: 48px;
    height: 48px;
    transform: rotate(90deg);
    vertical-align: middle;
  }
  .set-time,
  .card {
    padding: 32px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
  }

  .card {
    image {
      width: 48px;
      height: 48px;
      vertical-align: middle;
    }
  }

  .grey {
    color: #999;
  }

  .time-detail {
    display: flex;
    padding-top: 32px;
    color: #797979;

    input {
      width: 56px;
      height: 48px;
      border-bottom: 1px solid #797979;
      margin-bottom: 12px;
    }
  }

  .min {
    margin-left: 12px;
  }

  .action {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #c87956;
    background: #fff;
  }

  .week {
    &-action {
      padding: 24px;
      display: flex;
      justify-content: space-between;
    }
    &-item {
      display: flex;
      justify-content: space-between;
      padding: 36px 24px;
      border-bottom: 1px solid #eeeeee;
    }

    .checked {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
