<template>
  <view class="electronic-page">
    <view class="electronic-date">
      <picker mode="date" @change="startDateChane">
        <image :src="dateIcon" class="date" mode="" />
        <text>
          {{ startDate }}
        </text>
        <image :src="arrowIcon" class="arrow" mode="" />
      </picker>
      <text class="electronic-date-seperator"></text>
      <picker mode="date" @change="endDateChange" :start="startDate">
        <image :src="dateIcon" class="date" mode="" />
        {{ endDate }}
        <image :src="arrowIcon" class="arrow" mode="" />
      </picker>
    </view>
    <view class="electronic-list">
      <view class="electronic-list-item" v-for="(bill, index) in billData.list" :key="index">
        <view class="electronic-list-row">
          <view class="electronic-list-date">
            <text class="electronic-list-icon"></text>
            {{ bill.time }}
            {{ bill.week }}
          </view>
          <view class="electronic-list-sum" v-show="!isMonthUser">{{ bill.amount }}</view>
        </view>
        <view class="electronic-list-row">
          <view>
            <text class="electronic-list-icon active"></text>
            味全产品 共
            {{ bill.num }}
            单
          </view>
          <view class="electronic-list-action" @tap="handleMore(bill)"
            >更多
            <image :src="arrowIcon" class="arrow" :class="bill.expand ? 'arrow-up' : 'arrow-down'" mode="" />
          </view>
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
            <view>单价: {{ !isMonthUser ? item.productPrice : '' }}</view>
            <view>数量: {{ item.num }}</view>
            <view
              >订单类型: <text class="yellow"> {{ typeMap[item.type] }}单</text></view
            >
            <!-- <view>原始发货单: {{ item.deliveryCode }}</view>
            <view>原始交货日: {{ item.deliveryDate }}</view> -->
          </view>
        </view>
      </view>
      <view v-if="showEmpty" class="empty">
        暂无数据
      </view>
    </view>
    <view class="electronic-total">
      <text style="color: #f93a4a;">{{ billData.num || '0' }}</text>
      <text>个订单</text>
      <text v-if="!isMonthUser">
        ，
        <text style="color: red">{{ billData.amount || '0' }}</text
        >元
      </text>
    </view>
  </view>
</template>

<script>
import { setTitle } from '@/utils'
import './index.less'
import dateIcon from '@/images/date.png'
import arrowIcon from '@/images/arrow-down.png'

export default {
  name: 'electronic-bill',
  components: {},
  computed: {
    defaultDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      return {
        year,
        month,
        day,
      }
    },
    showEmpty() {
      return !this.billData?.list?.length && this.hasGetOrder
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    isMonthUser() {
      return this.userInfo.accountType === '02'
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
        '01': '发货',
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
      dateIcon,
      arrowIcon,
    }
  },
  mounted() {
    const { year, month, day } = this.defaultDate
    this.startDate = `${year}-${month}-01`
    this.endDate = `${year}-${month}-${day}`
    this.getBillList()
    setTitle({
      title: '电子对账单',
    })
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
          this.hasGetOrder = true
        })
    },
    handleMore(bill) {
      this.$set(bill, 'expand', !bill.expand)
    },
    startDateChane(e) {
      this.startDate = e.detail.value

      if (this.startDate && this.endDate) {
        this.getBillList()
      }
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
