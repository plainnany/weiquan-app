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
              <input v-model="hour" />
              <view>点</view>
            </view>
            <view>:</view>
            <view class="min">
              <input v-model="min" />
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
      <view class="card" @tap="handleDate">
        <view class="card-item">重复</view>
        <view class="card-item grey"> {{ repeatDate }} <image :src="backImg" mode="" /> </view>
      </view>
      <view class="card" @tap="addLabel">
        <view class="card-item">标签</view>
        <view class="card-item grey"
          >{{ remarks || '下单提醒' }}
          <image class="arrow" :src="backImg" mode="" />
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
    <view class="order-edit-label" v-if="labelVisible">
      <view class="input-wrap">
        <input type="text" v-model="remarks" placeholder="请输入标签" />
        <image class="close" :src="closeImg" @tap="() => (this.remarks = '')" />
      </view>
      <view class="back" @tap="() => (this.labelVisible = false)">
        <image :src="backImg" />
      </view>
    </view>
  </view>
</template>
<script>
import { setTitle } from '@/utils'
import Taro from '@tarojs/taro'
import backImg from '@/images/user/back.png'
import checkedImg from '@/images/checked.svg'
import closeImg from '@/images/close.png'

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
      closeImg,
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
      remarks: '',
      dateChooseVisible: false,
      labelVisible: false,
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
      const { noticeTime, noticeDate, remarks } = this.noticeData
      const [hour, min] = (noticeTime || '').split(':')
      this.hour = hour
      this.min = min
      this.repeatDate = this.getNoticeDay(noticeDate)
      this.remarks = remarks
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
      date = date || ''
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
    addLabel() {
      this.labelVisible = true
      // const url = `/pages/order-notice/label?type=${this.editType}&data=${JSON.stringify(this.getParams())}`
      // Taro.navigateTo({ url })
    },
    getParams() {
      const params = {
        noticeTime: this.hour + ':' + this.min,
        noticeDate: this.weeks
          .filter(v => v.checked)
          .map(v => v.value)
          .join(','),
        remarks: this.remarks,
      }

      if (this.editType === 'edit') {
        params.oid = this.noticeData.oid
      }

      return params
    },
    handleSave() {
      const params = this.getParams()

      this.$API.editNotice(params).then(() => {
        this.goBack()
      })
    },
    confirmLabel(remarks) {
      this.remarks = this.remarks
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
      width: 100px;
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

.order-edit-label {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  font-size: 36px;
  background-color: rgb(240, 242, 245);
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  .input-wrap {
    width: 100%;
    position: relative;
    background: #fff;
    border-radius: 12px;

    .close {
      width: 24px;
      height: 24px;
      position: absolute;
      right: 24px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  input {
    width: calc(100% - 64px);
    padding: 24px 16px;
  }

  .back {
    position: absolute;
    left: 24px;
    top: 24px;
    transform: rotate(180deg);

    image {
      width: 64px;
      height: 64px;
    }
  }
}
</style>
