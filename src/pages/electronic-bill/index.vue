<template>
  <view class="electronic-page">
    <view class="electronic-date">
      <picker mode="date" @change="startDateChane">{{ startDate || defaultDate }}</picker>
      <text class="electronic-date-seperator">|</text>
      <picker mode="date" @change="endDateChange" :start="startDate">{{ endDate || defaultDate }}</picker>
    </view>
    <view class="electronic-list">
      <view class="electronic-list-item" v-for="(bill, index) in billList" :key="index">
        <view class="electronic-list-row">
          <view class="electronic-list-date">
            <text class="electronic-list-icon"></text>
            {{ bill.date }}
          </view>
          <view class="electronic-list-sum">{{ bill.money }}</view>
        </view>
        <view class="electronic-list-row">
          <view>
            <text class="electronic-list-icon active"></text>
            {{ bill.product }}
            {{ bill.volume }}
            {{ bill.number }}
          </view>
          <view class="electronic-list-action" @tap="handleMore(bill)">更多</view>
        </view>
        <view class="electronic-list-extra" v-if="bill.expand">
          <view class="electronic-list-row">
            <view>
              {{ bill.product }}
            </view>
            <view class="electronic-list-sum">{{ bill.money }}</view>
          </view>
          <view>规格: 1盒</view>
          <view>单价: 12/盒</view>
          <view>退货数量: 4</view>
          <view>订单类型: 退货单</view>
          <view>原始发货单: 121222</view>
          <view>原始交货日: 2022-1-11</view>
        </view>
      </view>
    </view>
    <view class="electronic-total">
      <text style="color: #f93a4a;">{{ 7 }}</text>
      <text>个订单，</text>
      <text style="color: red">480</text>元
    </view>
  </view>
</template>

<script>
import { setTitle } from '@/utils'
import './index.less'

export default {
  name: 'electronic-bill',
  components: {},
  mounted() {
    setTitle({
      title: '电子对账单',
    })
  },
  computed: {
    defaultDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      return `${year}-${month}-${day}`
    },
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      billList: [
        {
          date: '2022-8-20 周六',
          product: '味全冷藏牛乳',
          volume: '950ml',
          number: '1单',
          money: '144.00元',
        },
        {
          date: '2022-8-20 周六',
          product: '味全冷藏牛乳',
          volume: '950ml',
          number: '1单',
          money: '144.00元',
        },
      ],
    }
  },
  methods: {
    handleMore(bill) {
      this.$set(bill, 'expand', !bill.expand)
    },
    startDateChane(e) {
      this.startDate = e.detail.value
      console.log(e.detail.value)
    },
    endDateChange(e) {
      this.endDate = e.detail.value
      console.log(e.detail.value)
    },
  },
}
</script>
