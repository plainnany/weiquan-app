<template>
  <view class="invoice-page">
    <view class="invoice-date-mode">
      <view class="date-mode-wrapper">
        <text
          class="date-mode-item"
          v-for="item in dateModeList"
          :class="{ active: dateMode === item.value }"
          :key="item.value"
          @tap="handleDateMode(item)"
          >{{ item.text }}</text
        >
      </view>
    </view>
    <view class="invoice-date">
      <picker mode="date" :value="startDate" :fields="dateMode" @change="startDateChange">
        <image :src="dateIcon" class="date" mode="" />
        <text>
          {{ startDate }}
        </text>
        <image :src="arrowIcon" class="arrow" mode="" />
      </picker>
      <text class="invoice-date-seperator"></text>
      <picker mode="date" :value="endDate" :fields="dateMode" @change="endDateChange" :start="startDate">
        <image :src="dateIcon" class="date" mode="" />
        {{ endDate }}
        <image :src="arrowIcon" class="arrow" mode="" />
      </picker>
    </view>
    <view class="invoice-list">
      <view class="invoice-list-group">
        <view class="invoice-list-group-header return">
          退货单
        </view>
        <view class="invoice-list-group-content">
          <view class="invoice-list-item" v-for="(bill, index) in billData.returnList" :key="index">
            <Card :bill="bill" :isMonthUser="isMonthUser" type="return" @handleCheck="handleCheck" @handleMore="handleMore" />
            <More v-if="bill.expand" :list="bill.list" :isMonthUser="isMonthUser" type="return" />
          </view>
          <view v-if="showEmpty(billData.returnList)" class="empty">
            暂无数据
          </view>
        </view>
      </view>
      <view class="invoice-list-group">
        <view class="invoice-list-group-header delivery">
          发货单
        </view>
        <view class="invoice-list-group-content">
          <view class="invoice-list-item" v-for="(bill, index) in billData.deliveryList" :key="index">
            <Card :bill="bill" :isMonthUser="isMonthUser" type="delivery" @handleCheck="handleCheck" @handleMore="handleMore" />
            <More v-if="bill.expand" :list="bill.list" :isMonthUser="isMonthUser" type="delivery" />
          </view>
          <view v-if="showEmpty(billData.deliveryList)" class="empty">
            暂无数据
          </view>
        </view>
      </view>
    </view>
    <view class="invoice-total invoice-footer">
      <view class="footer-top">
        <view class="left">
          <checkbox :checked="checkAll" :disabled="checkAllDisable" @tap="handleCheckAll">全选</checkbox>
        </view>
        <view class="right">
          <view
            ><text class="high">{{ totalOrder.length }}</text
            >个订单，<text class="high">{{ total }}</text
            >元</view
          >
          <view
            >(发货单<text class="high">{{ totalDelivery.length }}</text
            >笔，退货单<text class="high">{{ totalReturn.length }}</text
            >笔)</view
          >
        </view>
      </view>
      <view class="submit">
        <view class="tip" @tap="handleNav"
          >用户申请开票须知
          <image :src="questionIcon" mode="" />
        </view>
        <view class="submit-btn" @tap="handleSubmit">提交</view>
      </view>
    </view>
    <Modal :visible="dialogVisible" v-if="dialogVisible" confirmText="提交" :title="invoiceText" @confirm="confirm" @cancel="cancel">
      <view class="invoice-form">
        <view class="invoice-form-item">
          <view class="label">抬头</view>
          <view class="content default">{{ invoiceForm.invoiceHead }}</view>
        </view>
        <view class="invoice-form-item">
          <view class="label">税号</view>
          <view class="content default">{{ invoiceForm.invoiceNumber }}</view>
        </view>
        <view class="invoice-form-item" v-if="invoiceType === '04' || invoiceType === '02'">
          <view class="label">开票地址</view>
          <view class="content">{{ invoiceForm.kpdz }}</view>
        </view>
        <view class="invoice-form-item" v-if="invoiceType === '04' || invoiceType === '02'">
          <view class="label">开户行</view>
          <view class="content">{{ invoiceForm.khh }}</view>
        </view>
        <view class="invoice-form-item" v-if="invoiceType === '04' || invoiceType === '01'">
          <view class="label">邮箱</view>
          <view class="content email">
            <input v-model="invoiceForm.email" placeholder="请输入邮箱" />
          </view>
        </view>
      </view>
      <CustomForm v-if="invoiceType === '03' || invoiceType === '02'" :invoiceForm="invoiceForm" />
      <view class="invoice-form-tips">(如遇发票抬头问题涉及退票，请勿提交，及时联络业务感谢)</view>
    </Modal>
    <view class="toast" v-if="errorToast.visible">
      <text>{{ errorToast.message }}</text></view
    >
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { setTitle } from '@/utils'
import './index.less'
import dateIcon from '@/images/date.png'
import arrowIcon from '@/images/arrow-down.png'
import Card from './card.vue'
import More from './more.vue'
import questionIcon from '@/images/question.svg'
import Modal from './modal.vue'
import CustomForm from './custom-form.vue'
import ToastMixin from '@/mixin/toast'

// isApply 0未开票 1已申请 2开票失败 3已开票
// invoiceFlg 01电子普票  02增票 03普票 04电子增

export default {
  name: 'invoice-page',
  mixins: [ToastMixin],
  components: {
    Card,
    More,
    Modal,
    CustomForm,
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      billData: {
        deliveryList: [],
        returnList: [],
      },
      typeMap: {
        '01': '发货单',
        '02': '退货单',
      },
      dateIcon,
      arrowIcon,
      checkAll: false,
      // 日期选择模式，月/日
      dateMode: 'month', // day/month
      dateModeList: [
        {
          text: '月',
          value: 'month',
        },
        {
          text: '日',
          value: 'day',
        },
      ],
      questionIcon,
      dialogVisible: false,
      invoiceForm: {}, // 提交开票信息
    }
  },
  computed: {
    // 上个月 & 上上月时间
    defaultDate() {
      // 上个月的数据
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth()

      const currentMonth = month === 0 ? 12 : month

      return {
        year: month === 0 ? year - 1 : year,
        month: currentMonth > 9 ? currentMonth : '0' + currentMonth,
      }
    },
    showEmpty() {
      return list => !list?.length && this.hasGetOrder
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    isMonthUser() {
      return this.userInfo.accountType === '02'
    },
    totalDelivery() {
      return (this.billData.deliveryList || []).filter(v => v.checked).flatMap(v => v.list)
    },
    totalReturn() {
      return (this.billData.returnList || []).filter(v => v.checked).flatMap(v => v.list)
    },
    totalOrder() {
      return this.totalDelivery.concat(this.totalReturn)
    },
    checkList() {
      const { deliveryList = [], returnList = [] } = this.billData
      return [...deliveryList, ...returnList].filter(v => v.checked)
    },
    total() {
      const total = this.checkList.reduce((pre, cur) => pre + Number(cur.amount), 0)
      return Number(total).toFixed(1)
    },
    // 开票类型，01电子普票  02增票 03普票 04电子增票
    invoiceType() {
      // return '04'
      return this.userInfo.invoiceFlg
    },
    invoiceText() {
      return {
        '01': '电子普票',
        '02': '增票',
        '03': '普票',
        '04': '电子增票',
      }[this.invoiceType]
    },
    checkAllDisable() {
      const list = [...this.billData.deliveryList, ...this.billData.returnList]
      return list.every(v => !v.canApply)
    },
  },

  mounted() {
    const { year, month } = this.defaultDate
    this.startDate = `${year}-${month}`
    this.endDate = `${year}-${month}`
    this.getBillList()
    setTitle({
      title: '开票申请',
    })
  },
  methods: {
    getBillList() {
      this.$API
        .electronicInvoice({
          start: this.startDate,
          end: this.endDate,
        })
        .then(data => {
          data = data || {}
          this.billData = {
            ...data,
            deliveryList: (data.deliveryList || []).map(v => ({
              ...v,
              checked: false,
              canApply: this.checkCanApply(v),
            })),
            returnList: (data.returnList || []).map(v => ({
              ...v,
              checked: false,
              canApply: this.checkCanApply(v),
            })),
          }
          this.hasGetOrder = true
          this.checkAll = false
        })
        .catch(err => this.showToast(err))
    },
    checkCanApply(item) {
      return item.isApply === '0' || !item.isApply
    },
    handleMore(bill) {
      this.$set(bill, 'expand', !bill.expand)
    },
    startDateChange(e) {
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
    handleCheckAll() {
      this.checkAll = !this.checkAll

      this.billData.deliveryList.forEach(v => {
        if (v.canApply) {
          v.checked = this.checkAll
        }
      })
      this.billData.returnList.forEach(v => {
        if (v.canApply) {
          v.checked = this.checkAll
        }
      })
    },
    handleCheck(bill, index) {
      bill.checked = !bill.checked
      const { deliveryList = [], returnList = [] } = this.billData
      this.checkAll = [...deliveryList, ...returnList].filter(v => v.canApply).every(v => v.checked)
    },
    handleDateMode(item) {
      this.dateMode = item.value
      const startDate = this.startDate.slice(0, 7)
      const endDate = this.endDate.slice(0, 7)

      if (item.value === 'month') {
        this.startDate = startDate
        this.endDate = endDate
      } else {
        const { year, month } = this.defaultDate
        var lastDayOfMonth = new Date(year, month, 0).getDate()
        this.startDate = `${year}-${month}-01`
        this.endDate = `${year}-${month}-${lastDayOfMonth}`
      }
    },
    handleNav() {
      Taro.navigateTo({
        url: '/pages/web-view/index?url=https://wsorder.weichuan.com.cn/invoice.htm',
      })
    },
    handleSubmit() {
      if (!this.checkList.length) {
        this.showToast({
          msg: '未选中开票订单!',
        })

        return
      }
      if (this.btnLoading) return
      this.btnLoading = true
      // userInfo。中的invoiceFlg判断用户开票类型
      this.$API
        .getCustomerlogisticsInfo()
        .then(data => {
          this.invoiceForm = data
          this.dialogVisible = true
          this.btnLoading = false
        })
        .catch(err => {
          this.showToast(err)
          this.btnLoading = false
        })
    },
    confirm() {
      this.btnLoading = true
      const dateStr = this.checkList.map(v => v.time).join(',')
      const params = {
        city: this.invoiceForm.city,
        county: this.invoiceForm.province,
        customerName: this.invoiceForm.customerName,
        detailAddress: this.invoiceForm.detailAddress,
        familyName: this.invoiceForm.familyName,
        monthFlg: '',
        phone: this.invoiceForm.phone,
        province: this.invoiceForm.province,
        provinceId: this.invoiceForm.provinceId,
        email: this.invoiceForm.email,
        strs: dateStr,
      }
      this.$API
        .applyInvoice(params)
        .then(data => {
          this.cancel()
          this.getBillList()
        })
        .catch(err => {
          this.showToast(err)
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    cancel() {
      this.invoiceForm = {}
      this.dialogVisible = false
    },
  },
}
</script>
