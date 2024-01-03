<template>
  <view class="order-detail">
    <view class="order-detail-type">
      <view class="order-detail-type-title"
        >{{ STATE_TYPE_TEXT[orderDetail.state]?.title }}
        <text v-if="orderDetail.state === STATE_TYPE.toPay && countDown">还剩下{{ countDown }}支付</text>
      </view>
      <view class="order-detail-type-sub-title">{{ STATE_TYPE_TEXT[orderDetail.state]?.subTitle }}</view>
      <view class="order-detail-status"> <image :src="STATE_TYPE_TEXT[orderDetail.state]?.icon" mode=""/></view>
      <view v-if="orderDetail.state === STATE_TYPE.toPay">若未支付订单将取消</view>
      <view v-if="isTodayDelivery" class="add-question" @tap.stop="addQuestion(orderDetail)">问题反馈</view>
    </view>
    <view class="order-detail-content">
      <view class="common-card">
        <view class="flex-between-center">
          <view class="order-detail-location">
            <image :src="locationIcon" mode="" />
          </view>
          <view class="order-detail-location-info">
            <view>
              <view>收货人：{{ userInfo.customerLinkMan }}</view>
              <view>{{ userInfo.customerAddress }}</view>
            </view>
            <view class="phone">{{ userInfo.customerLinkTel }}</view>
          </view>
        </view>
        <view class="flex-between-center" v-if="showDriver">
          <view class="order-detail-location">
            <image :src="driverIcon" mode="" class="driver" />
          </view>
          <view class="order-detail-location-info" style="align-items: center">
            <view>配送员：{{ orderDetail.driverName || '' }}</view>
            <view class="phone" @tap="contact">
              <image :src="drivePhoneIcon" mode="" />
            </view>
          </view>
        </view>
        <!-- <view class="order-detail-nav">
          <image :src="backIcon" mode="" />
        </view> -->
      </view>
      <view class="order-detail-wrapper" :class="{ margin: !isTodayDelivery }">
        <view v-for="(product, index) in orderDetail.list" :key="index" class="order-detail-item border">
          <view class="flex-between-center" style="padding: 24rpx 30rpx;">
            <view class="flex-between-center">
              <view class="order-detail-image">
                <image :src="product.productImage" mode="" />
              </view>
              <view class="order-detail-info">
                <view>{{ product.productName }}</view>
                <view class="grey">{{ product.productSpecs }} {{ product.specifications }}</view>
                <view class="order-detail-tag"
                  ><text :class="colorMap[product.orderType]">{{ ORDER_TYPE[product.orderType] }}</text>
                  <text class="green" v-if="product.deliveryRepair === '01'">补验收</text>
                </view>
                <view class="grey" v-if="!isTodayDelivery"
                  >{{ product.state === '05' ? '签收' : '交货' }}时间 {{ product.deliveryDate }}</view
                >
                <view class="grey" v-if="product.originDeliveryData">原始日期 {{ product.originDeliveryData }}</view>
              </view>
            </view>
            <view class="order-detail-right">
              <view class="order-detail-price" v-if="product.price"
                >¥ <text>{{ product.price }}</text></view
              >
              <view>{{ isTodayDelivery ? 'X' : '订单量:' }} {{ product.productSum }}</view>
              <view v-if="/05|09/.test(product.state)">实收量: {{ product.logisticsSum || '0' }}</view>
              <view class="order-detail-done-status" v-if="/05/.test(product.state)">已完成</view>
              <view class="order-detail-done-status" v-else-if="/02|03/.test(product.state)">待发货</view>
              <view class="order-detail-done-status" v-else-if="/04/.test(product.state) && !isTodayDelivery">当天收货</view>
              <!-- 只有现金用户有待付款 -->
              <view class="order-detail-done-status" v-if="/01/.test(product.state) && userInfo.accountType === '01'">待付款</view>
              <view class="order-detail-done-status" v-if="/09/.test(product.state) && userInfo.accountType === '01'">异常订单</view>
            </view>
          </view>
          <view class="flex-between-center product-batch" v-if="product.firstBatchCode">
            <view>批次号</view>
            <view class="flex-between-center">
              <view class="batch-num">{{ product.firstNum }}</view>
              <view>{{ product.firstBatchCode }}</view>
            </view>
          </view>
          <view class="flex-between-center product-batch" v-if="product.secondBatchCode">
            <view>批次号</view>
            <view class="flex-between-center">
              <view class="batch-num">{{ product.secondNum }}</view>
              <view>{{ product.secondBatchCode }}</view>
            </view>
          </view>
        </view>

        <view class="flex-between-center" style="padding: 24rpx 30rpx" v-if="showPrice">
          <text>订单合计金额</text>
          <text class="order-detail-total">¥ {{ total }}</text>
        </view>
      </view>

      <!-- 普通订单详情 -->
      <view class="common-card" v-if="!isTodayDelivery">
        <view class="order-detail-item">
          <text class="order-detail-color-grey">订单编号：</text>
          <text class="order-detail-color-grey">{{ orderDetail.customerOrderCode }}</text>
        </view>
        <view class="order-detail-item">
          <text class="order-detail-color-grey">下单时间：</text>
          <text class="order-detail-color-grey" v-if="userInfo.accountType === '02'">{{ orderDetail.createDate?.split(' ')[0] }}</text>
          <text class="order-detail-color-grey" v-else>{{ orderDetail.createDate }}</text>
        </view>
        <view class="order-detail-item" v-if="orderDetail.payDate && userInfo.accountType === '01' && /02|09/.test(orderDetail.state)">
          <text class="order-detail-color-grey">付款时间：</text>
          <text class="order-detail-color-grey">{{ orderDetail.payDate }}</text>
        </view>
        <!-- <view class="flex-between-center order-detail-item">
          <text class="order-detail-color-grey">付款方式</text>
          <text>支付宝</text>
        </view> -->
        <!-- <view class="flex-between-center order-detail-item">
          <text class="order-detail-color-grey">交易流水号</text>
          <text>183772889499495885993884</text>
        </view> -->
      </view>
      <!-- 当天收货详情 -->
      <view class="to-delivery" v-else>
        <view class="order-detail-item">
          <text class="order-detail-color-grey">预计到货：{{ orderDetail.deliveryDate }}</text>
        </view>
        <view class="to-delivery-btn">
          <nan-button type="primary" @tap="viewLogistics">查看物流</nan-button>
        </view>
      </view>
    </view>
    <view class="order-detail-footer flex-between-center">
      <view></view>
      <view class="flex-between-center">
        <nan-button type="plain" @tap="buyAgain" v-if="!isTodayDelivery">再下一单</nan-button>
        <nan-button type="plain" v-if="orderDetail.state === STATE_TYPE.toPay" @tap="cancelOrder">取消订单</nan-button>
        <nan-button type="primary" v-if="orderDetail.state === STATE_TYPE.toPay" @tap="handlePay">立即支付</nan-button>
        <nan-button type="primary" v-if="isTodayDelivery" @tap="confirmDelivery">确认订单</nan-button>
      </view>
    </view>
    <view v-if="payDialogVisible" class="order-pay-modal">
      <view :class="['order-pay-modal-wrap']"></view>
      <view :class="['order-pay-modal-wrapper']">
        <view class="order-pay">
          <!-- 头部 -->
          <view class="order-pay-title">
            <view style="color: #fa4a2d">支付金额 {{ userInfo.dianZhang ? `¥${payData.total_fee}` : '****' }}</view>
            <view @tap.stop="handleClosePay" class="order-pay-close">
              <image :src="closeIcon" mode="" />
            </view>
          </view>
          <view class="order-pay-content">
            <radio-group @change="onPaymethodChange">
              <label class="order-pay-item flex-between-center" v-for="payItem in payList" :key="payItem.name">
                <view class="flex-between-center">
                  <view>
                    <image :src="payItem.icon" mode="" />
                  </view>
                  <view>
                    {{ payItem.name }}
                    <text v-if="payItem.method === 'weixin-pocket'"> ({{ userInfo.accoutBalance }}) </text>
                  </view>
                </view>
                <view>
                  <radio
                    :value="payItem.method"
                    :checked="payItem.method === payMethod"
                    color="#fa4a2d"
                    v-show="payItem.method === payMethod"
                  />
                </view>
              </label>
            </radio-group>
          </view>
          <view class="order-pay-footer">
            <nan-button type="primary" :loading="btnLoading" @tap="confirmPay">确认支付</nan-button>
          </view>
        </view>
      </view>
    </view>
    <view class="toast" v-if="showError"> <text>无法联系</text></view>
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'
import locationIcon from '@/images/location.png'
import backIcon from '@/images/user/back.png'
import Taro from '@tarojs/taro'
import wechatIcon from '@/images/wechat.png'
import weipocketIcon from '@/images/wei-pocket.png'
import closeIcon from '@/images/close.png'
import driverIcon from '@/images/driver.png'
import drivePhoneIcon from '@/images/drive-phone.png'
import orderDetailIcon from '@/images/order-detail.png'
import orderDetail2Icon from '@/images/order-detail-2.png'
import orderDetailEndIcon from '@/images/order-detail-end.png'
import orderDetailPayIcon from '@/images/order-detail-pay.png'

export default {
  components: {},
  data() {
    return {
      locationIcon,
      backIcon,
      closeIcon,
      wechatIcon,
      weipocketIcon,
      driverIcon,
      drivePhoneIcon,
      ORDER_TYPE: {
        '01': '正常单',
        '02': '样品单',
        '03': '搭赠单',
      },
      orderDetail: {
        list: [],
      },
      // "state":"01待付款;02,03,04:待发货05:已完成",09-异常单
      STATE_TYPE: {
        toPay: '01',
        toDeliver: '02',
        toDeliver: '03',
        toDeliver: '04',
        done: '05',
      },
      payDialogVisible: false,
      payData: {},
      payMethod: '',
      // payList: [
      //   {
      //     method: 'weixin-pocket',
      //     name: '余额支付',
      //     icon: weipocketIcon,
      //   },
      //   {
      //     method: 'weixin',
      //     name: '微信支付',
      //     icon: wechatIcon,
      //   },
      // ],
      colorMap: {
        '01': '',
        '02': 'sample',
        '03': 'gift',
      },
      btnLoading: false,
      countDown: '',
      orderType: '',
      showError: false,
    }
  },
  computed: {
    payList() {
      if (this.userInfo.accountType === '02' || !this.userInfo.dianZhang) {
        this.payMethod = ''
        return [
          {
            method: 'weixin-2',
            name: '微信好友支付',
            icon: wechatIcon,
          },
        ]
      }
      return [
        {
          method: 'weixin-pocket',
          name: '余额支付',
          icon: weipocketIcon,
        },
        {
          method: 'company-pocket',
          name: '总部支付',
          icon: weipocketIcon,
        },
        {
          method: 'weixin',
          name: '微信支付',
          icon: wechatIcon,
        },
        {
          method: 'weixin-2',
          name: '微信好友代付',
          icon: wechatIcon,
        },
      ]
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    total() {
      return this.orderDetail.list.reduce((prev, cur) => prev + parseFloat(cur.amount), 0)
    },
    isTodayDelivery() {
      return this.orderType === 'to-delivery'
    },
    STATE_TYPE_TEXT() {
      if (this.isTodayDelivery) {
        return {
          '02': {
            title: '卖家已发货',
            subTitle: '送达后，请及时配合收货人员做当前签收',
            icon: orderDetailIcon,
          },
          '03': {
            title: '卖家已发货',
            subTitle: '送达后，请及时配合收货人员做当前签收',
            icon: orderDetailIcon,
          },
          '04': {
            title: '卖家已发货',
            subTitle: '送达后，请及时配合收货人员做当前签收',
            icon: orderDetailIcon,
          },
        }
      }
      return {
        '01': {
          title: '待付款',
          subTitle: '',
          icon: orderDetailPayIcon,
        },
        '02': {
          title: '等待发货',
          subTitle: '买家已下单，等待卖家发货',
          icon: orderDetail2Icon,
        },
        '03': {
          title: '等待发货',
          subTitle: '买家已下单，等待卖家发货',
          icon: orderDetail2Icon,
        },
        '04': {
          title: '等待发货',
          subTitle: '买家已下单，等待卖家发货',
          icon: orderDetail2Icon,
        },
        '05': {
          title: '已完成',
          subTitle: '订单已完成',
          icon: orderDetailEndIcon,
        },
        '09': {
          title: '等待发货',
          subTitle: '买家已下单，等待卖家发货',
          icon: orderDetail2Icon,
        },
      }
    },
    showDriver() {
      return !/01|02|03/.test(this.orderDetail.state) && !this.isTodayDelivery
    },
    showPrice() {
      return this.orderDetail.state === '01' && this.$store.state.userInfo.showPrice
    },
  },
  mounted() {
    setTitle({ title: '我的订单' })
  },
  onShow() {
    const { order, type } = Taro.getCurrentInstance().router.params
    this.orderType = type // to-delivery: 当天收货
    this.getOrder(order)
  },
  methods: {
    clickTab({ key }) {
      this.activeTab = key
    },
    getOrder(orderNumber) {
      if (this.isTodayDelivery) {
        return this.$API
          .todayDeliveryOrder({
            pageNo: 1,
            limit: 1000,
          })
          .then(data => {
            this.orderDetail = {
              ...data,
              list: data.delivery || [],
              state: '04',
            }
          })
      }
      this.$API
        .getOrderDetail({
          // orderNumber: '2022091920365617123456789',
          orderNumber,
        })
        .then(data => {
          this.orderDetail = data
          this.handleCountDown()
        })
    },
    handleCountDown() {
      if (!this.orderDetail.createDate) return
      const endTime = this.getEndTime()
      const currentTime = new Date().getTime()
      const timeDifference = endTime - currentTime

      const minutes = Math.floor(timeDifference / (1000 * 60))
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
      this.minutes = Number(minutes)
      this.seconds = Number(seconds)
      if (this.minutes && this.seconds) {
        this.seconds -= 1
        if (this.seconds === 0) {
          this.minutes -= 1
        }
        if (this.minutes === 0 && this.seconds === 0) {
          return
        }
        this.countDown = `${this.minutes}:${this.seconds <= 9 ? '0' + this.seconds : this.seconds}`
        this.setCountDown()
      }
    },
    getEndTime() {
      const now = new Date(this.orderDetail.createDate)
      return now.getTime() + 15 * 60 * 1000 // 15分钟后
    },

    setCountDown() {
      this.timer = setTimeout(() => {
        if (this.seconds === 0) {
          this.seconds = 60
          this.minutes -= 1
        }
        this.seconds -= 1

        if (this.minutes === 0 && this.seconds === 0) {
          clearTimeout(this.timer)
          this.countDown = ''
          Taro.navigateTo({ url: '/pages/order/index' })
        } else {
          this.countDown = `${this.minutes}:${this.seconds <= 9 ? '0' + this.seconds : this.seconds}`
          this.setCountDown()
        }
      }, 1000)
    },
    cancelOrder() {
      this.$API
        .deleteOrder({
          mainOrderNumber: this.orderDetail.customerOrderCode,
        })
        .then(data => {
          Taro.navigateTo({ url: `/pages/order/index` })
        })
    },
    handlePay() {
      this.$API
        .orderPay({
          orderNumber: this.orderDetail.customerOrderCode,
        })
        .then(data => {
          if (data) {
            this.payData = data
            this.showModal()
          }
        })
    },
    handleClosePay() {
      this.hideModal()
    },
    onPaymethodChange(e) {
      this.payMethod = e.detail.value
    },
    confirmPay() {
      if (this.payMethod === 'weixin-pocket' || this.payMethod === 'company-pocket') {
        this.btnLoading = true
        const method = {
          'weixin-pocket': 'balancePayment',
          'company-pocket': 'balanceParentPayment',
        }
        this.$API[method]({
          out_trade_no: this.payData.out_trade_no,
          orderNumber: this.payData.orderNumber,
        })
          .then(data => {
            if (data) {
              this.btnLoading = false
              this.hideModal()
              Taro.showToast({
                title: '支付成功',
                icon: 'success',
              })
              Taro.navigateTo({ url: `/pages/order/index` })
            }
          })
          .catch(err => {
            this.btnLoading = false
            Taro.showToast({
              title: err.msg,
              icon: 'error',
            })
          })
      } else if (this.payMethod === 'weixin') {
        Taro.navigateTo({
          url: `/pages/web-view/index?url=${this.payData.wechatUrl}`,
        })
      }
    },

    showModal() {
      this.payDialogVisible = true
    },
    hideModal() {
      this.payMethod = ''
      this.payDialogVisible = false
    },
    contact() {
      if (!this.$store.state.userInfo.customerService) {
        Taro.showToast({
          title: '用户未登录，请先登录',
          icon: 'none',
        })

        setTimeout(() => {
          Taro.navigateTo({ url: '/pages/bind-account/index' })
        }, 2000)
        return
      }
      if (this.orderDetail.driverTel) {
        Taro.makePhoneCall({
          phoneNumber: this.orderDetail.driverTel,
        })
      } else {
        this.showError = true
        setTimeout(() => {
          this.showError = false
        }, 3000)
      }
    },
    buyAgain() {
      this.$API
        .anotherOne({
          orderNumber: this.orderDetail.customerOrderCode,
        })
        .then(() => {
          Taro.switchTab({ url: '/pages/shop/index' })
        })
    },
    // 查看物流
    viewLogistics() {
      Taro.navigateTo({ url: `/pages/web-view/index?url=${this.$store.state.userInfo.mapUrl}` })
    },
    confirmDelivery() {
      if (this.confirmBtnLoading) return
      this.confirmBtnLoading = true
      const json = this.orderDetail?.list?.map(v => ({ orderCode: v.orderCode, amount: v.productSum, minOrderQuantity: v.configSum }))
      this.$API
        .confirmReceipt({ json: JSON.stringify(json) })
        .then(() => {
          this.getOrder()
        })
        .catch(err => {
          Taro.showToast({
            title: err.msg,
            icon: 'error',
          })
        })
        .finally(() => {
          this.confirmBtnLoading = false
        })
    },
    addQuestion(order) {
      const { productName } = order.list[0] || {}
      Taro.navigateTo({ url: `/pages/comment/index?type=add&productName=${productName}` })
    },
  },
}
</script>
