<template>
  <view class="electronic-page">
    <view class="electronic-date">
      <picker mode="date" @change="startDateChane">{{ startDate || defaultDate }}</picker>
      <text class="electronic-date-seperator">|</text>
      <picker mode="date" @change="endDateChange" :start="startDate">{{ endDate || defaultDate }}</picker>
    </view>
    <view class="electronic-list">
      <view class="electronic-list-item" v-for="(bill, index) in billData.list" :key="index">
        <view class="electronic-list-row">
          <view class="electronic-list-date">
            <text class="electronic-list-icon"></text>
            {{ bill.time }}
            {{ bill.week }}
          </view>
          <view class="electronic-list-sum">{{ bill.amount }}</view>
        </view>
        <view class="electronic-list-row">
          <view>
            <text class="electronic-list-icon active"></text>
            <!-- {{ bill.product }}
            {{ bill.volume }} -->
            {{ bill.num }}
          </view>
          <view class="electronic-list-action" @tap="handleMore(bill)">更多</view>
        </view>
        <view v-if="bill.expand">
          <view class="electronic-list-extra" v-for="(item, subIndex) in bill.list" :key="subIndex">
            <view class="electronic-list-row">
              <view>
                {{ item.productName }}
              </view>
              <view class="electronic-list-sum">{{ item.price }}</view>
            </view>
            <view>规格: {{ item.productUnitConvertRule }}</view>
            <view>单价: {{ item.productPrice }}</view>
            <view>{{ typeMap[item.type] }}数量: {{ item.num }}</view>
            <view>订单类型: {{ typeMap[item.type] }}单</view>
            <view>原始发货单: {{ item.deliveryCode }}</view>
            <view>原始交货日: {{ item.deliveryDate }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="electronic-total">
      <text style="color: #f93a4a;">{{ billData.num }}</text>
      <text>个订单，</text>
      <text style="color: red">{{ billData.amount }}</text
      >元
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
      billData: {
        num: '',
        amount: '',
        list: [],
      },
      typeMap: {
        '01': '领货',
        '02': '退货',
      },
      billList: [
        {
          time: '时间',
          week: '周几',
          amount: '金额',
          num: '数量',
          list: [
            {
              productName: '品项名称',
              productUnitConvertRule: '品项规格',
              productPrice: '单价',
              num: '数量',
              price: '金额',
              deliveryCode: '发货单号',
              deliveryDate: '交货日期',
              type: '01领货/02退货',
            },
          ],
        },
      ],
    }
  },
  mounted() {
    this.getBillList()
  },
  methods: {
    getBillList() {
      this.$API
        .getBillList({
          start: this.startDate,
          end: this.endDate,
        })
        .then(data => {
          this.billData = data
        })
    },
    handleMore(bill) {
      this.$set(bill, 'expand', !bill.expand)
    },
    startDateChane(e) {
      this.startDate = e.detail.value
    },
    endDateChange(e) {
      this.endDate = e.detail.value

      if (this.startDate && this.endDate) {
        this.getBillList()
      }
    },
  },
}
</script>
