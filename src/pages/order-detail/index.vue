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
                <view class="grey" v-if="product.deliveryRepair === '01'">原始日期 {{ product.originDeliveryData || '' }}</view>
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
      <template v-if="!isTodayDelivery">
        <!-- 普通订单详情 -->
        <view class="common-card">
          <view class="order-detail-item">
            <text class="order-detail-color-grey">订单编号：</text>
            <text class="order-detail-color-grey">{{ orderDetail.customerOrderCode }}</text>
          </view>
          <view class="order-detail-item">
            <text class="order-detail-color-grey">下单时间：</text>
            <text class="order-detail-color-grey">{{ orderDetail.createDate }}</text>
          </view>
          <view class="order-detail-item" v-if="orderDetail.payDate && userInfo.accountType === '01' && /02|09|04/.test(orderDetail.state)">
            <text class="order-detail-color-grey">付款时间：</text>
            <text class="order-detail-color-grey">{{ orderDetail.payDate }}</text>
          </view>
        </view>
        <view class="common-card">
          <view class="order-detail-delivery">
            <view class="order-detail-delivery-title">
              <text>交货规则</text>
              <view class="line"></view>
            </view>
            <view class="order-detail-delivery-rule">
              <view v-for="(rule, idx) in deliveryRules" :key="idx" class="delivery-rule-item">
                <view>{{ rule.productName }}</view>
                <view>规则：{{ rule.ruleName }}</view>
              </view>
            </view>
          </view>
        </view>
      </template>

      <!-- 当天收货详情 -->
      <view class="to-delivery" v-else>
        <view class="order-detail-item">
          <text class="order-detail-color-grey">预计到货：{{ orderDetail.deliveryDate }}</text>
        </view>
        <view class="to-delivery-btn" v-if="userInfo.isMap === '01'">
          <nan-button type="primary" @tap="viewLogistics">查看物流</nan-button>
        </view>
      </view>
    </view>

    <view class="order-detail-footer flex-between-center">
      <view></view>
      <view class="flex-between-center">
        <nan-button type="plain" @tap="handleQuery" v-if="showQueryBtn">查询&修改</nan-button>
        <nan-button type="plain" @tap="buyAgain" v-if="!isTodayDelivery">再下一单</nan-button>
        <nan-button type="plain" v-if="orderDetail.state === STATE_TYPE.toPay" @tap="handleCancelOrder">取消订单</nan-button>
        <nan-button type="primary" v-if="orderDetail.state === STATE_TYPE.toPay" @tap="handlePay">立即支付</nan-button>
        <nan-button type="primary" v-if="isTodayDelivery" @tap="confirmDelivery">确认订单</nan-button>
      </view>
    </view>
    <view v-if="payDialogVisible" class="order-pay-modal">
      <view :class="['order-pay-modal-wrap']" @tap="hideModal"></view>
      <view :class="['order-pay-modal-wrapper']">
        <view class="order-pay">
          <!-- 头部 -->
          <view class="order-pay-title">
            <view style="color: #fa4a2d">支付金额 {{ userInfo.dianZhang ? `¥${payData.total_fee}` : '****' }}</view>
            <!-- <view @tap.stop="handleClosePay" class="order-pay-close">
              <image :src="closeIcon" mode="" />
            </view> -->
          </view>
          <pay-method
            :showTipModal="showTipModal"
            :initPayMethod="initPayMethod"
            @change="onPayMethodChange"
            @cancel="cancelModal"
            @confirm="confirmPay"
          />
          <view class="order-pay-footer">
            <nan-button type="primary" :loading="btnLoading" @tap="handleConfirm">立即支付</nan-button>
          </view>
        </view>
      </view>
    </view>
    <view class="toast" v-if="errorToast.visible">
      <text>{{ errorToast.message }}</text></view
    >
    <Modal
      :visible="modalDialog.visible"
      v-if="modalDialog.visible"
      :title="modalDialog.title"
      :cancelText="modalDialog.cancelText"
      :confirmText="modalDialog.okText"
      @cancel="modalDialog.cancelFn"
      @confirm="modalDialog.confirmFn"
    >
      <view>{{ modalDialog.content }}</view>
    </Modal>
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
import Modal from '../setting/modal.vue'
import ToastMixin from '@/mixin/toast'

export default {
  components: { Modal },
  mixins: [ToastMixin],
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
      payMethod: 'weixin-pocket',
      colorMap: {
        '01': '',
        '02': 'sample',
        '03': 'gift',
      },
      btnLoading: false,
      countDown: '',
      orderType: '',
      showError: false,
      showTipModal: false,
      modalDialog: {
        visible: false,
      },
      initPayMethod: '',
      deliveryRules: [], // 交货规则
    }
  },
  onShareAppMessage(res) {
    // 调用此方法时，会重新触发onShow，以及。app.js中的onShow,暂时只处理当前页面中的onShow方法
    this.notTrigger = true
    return {
      title: '老板，订货请支付！',
      path: `/pages/web-view/index?url=${encodeURIComponent(this.payData.wechatUrl)}`,
      imageUrl: 'http://foodservice-main.oss-cn-hangzhou.aliyuncs.com/kd/fx.png',
      // promise,
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    total() {
      return this.orderDetail.list.reduce((prev, cur) => prev + parseFloat(cur.amount), 0)
    },
    isTodayDelivery() {
      return this.orderType === 'to-delivery'
    },
    showQueryBtn() {
      return !!this.orderDetail.queryFlg
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
      return !/01|02|03|09/.test(this.orderDetail.state) && !this.isTodayDelivery
    },
    showPrice() {
      return this.orderDetail.state === '01' && this.$store.state.userInfo.showPrice
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  mounted() {
    setTitle({ title: '我的订单' })
  },
  onShow() {
    if (this.notTrigger) return
    const { order, type } = Taro.getCurrentInstance().router.params
    this.orderType = type // to-delivery: 当天收货
    this.getOrder(order)
    this.getProductRule(order)
  },
  methods: {
    initPay() {
      if (this.userInfo.accountType === '02' || !this.userInfo.dianZhang) {
        this.payMethod = 'weixin-2'
        return 'weixin-2'
      }

      return 'weixin-pocket'
    },
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
    getProductRule(orderNumber) {
      this.$API
        .getProductRule({
          customOrderCode: orderNumber,
        })
        .then(data => {
          this.deliveryRules = data || []
        })
    },
    handleCountDown() {
      if (!this.orderDetail.createDate) return
      const endTime = this.getEndTime()
      const currentTime = new Date().getTime()
      const timeDifference = endTime - currentTime

      if (timeDifference <= 0) {
        // 超过15min付款时间，直接显示00
        this.countDown = '0:0'
        return
      }

      const minutes = Math.floor(timeDifference / (1000 * 60))
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
      this.minutes = Number(minutes)
      this.seconds = Number(seconds)
      if (this.minutes && this.seconds) {
        this.seconds -= 1
        if (this.seconds === 0) {
          this.minutes -= 1
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

        if (this.minutes <= 0 && this.seconds <= 0) {
          clearTimeout(this.timer)
          this.countDown = ''
          Taro.redirectTo({ url: '/pages/order/index' })
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
          Taro.redirectTo({ url: `/pages/order/index?type=to-pay` })
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
    onPayMethodChange(e) {
      this.payMethod = e.detail.value
    },
    cancelModal() {
      this.showTipModal = false
    },
    handleCancelOrder() {
      this.modalDialog = {
        title: '删除订单',
        content: '一旦取消订单，将不再显示？',
        visible: true,
        okText: '取消订单',
        cancelText: '放弃',
        cancelFn: () => {
          this.modalDialog = {}
        },
        confirmFn: () => this.cancelOrder(),
      }
    },
    handleConfirm() {
      if (this.payMethod === 'company-pocket') {
        this.showTipModal = true
      } else {
        this.confirmPay()
      }
    },
    confirmPay() {
      if (this.payMethod === 'weixin-pocket' || this.payMethod === 'company-pocket' || this.payMethod === 'activity-pocket') {
        this.btnLoading = true
        const method = {
          'weixin-pocket': 'balancePayment',
          'company-pocket': 'balanceParentPayment',
          'activity-pocket': 'activityBalancePayment',
        }[this.payMethod]
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
              Taro.redirectTo({ url: `/pages/order/index` })
            }
          })
          .catch(err => {
            this.btnLoading = false
            this.hideModal()
            if (err.returnCode === 333) {
              this.modalDialog = {
                visible: true,
                content: '余额不足是否充值？',
                title: '提示',
                okText: '去充值',
                cancelText: '取消',
                cancelFn: () => {
                  this.modalDialog = {}
                },
                confirmFn: () => {
                  this.modalDialog = {}
                  Taro.navigateTo({ url: '/pages/charge/index' })
                },
              }
            } else {
              this.showToast(err)
            }
          })
      } else if (this.payMethod === 'weixin') {
        // 如果是微信支付，SurplusPage=01 跳转中间支付倒计时页面，然后拉起微信小程序支付
        // 否则，直接拉起微信小程序支付
        this.$API
          .unifiedorder({
            _data: JSON.stringify({
              out_trade_no: this.payData.out_trade_no,
              total_fee: this.payData.total_fee,
            }),
          })
          .then(data => {
            this.hideModal()
            if (data.surplusPage === '01') {
              Taro.redirectTo({
                url: `/pages/pay-countdown/index?orderNumber=${this.payData.orderNumber}&tradeNumber=${this.payData.out_trade_no}`,
              })
            } else {
              wx.requestPayment({
                ...data,
                appId: data.appid,
                package: data.packageStr,
                success: res => {
                  Taro.redirectTo({ url: '/pages/order/index?type=to-pay' })
                },
                fail: err => {
                  this.showToast(err)
                },
                complete: function(res) {},
              })
            }
          })
          .catch(err => {
            this.showToast(err)
          })
      }
    },

    showModal() {
      this.payDialogVisible = true
      this.resetPayMethod()
    },
    hideModal() {
      this.payDialogVisible = false
      this.resetPayMethod()
    },
    resetPayMethod() {
      this.initPayMethod = this.initPay()
      this.payMethod = this.initPayMethod
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
        this.showToast({ msg: '无法联系' })
        // this.showError = true
        // setTimeout(() => {
        //   this.showError = false
        // }, 3000)
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
        .catch(err => {
          this.showToast(err)
        })
    },
    // 查看物流
    viewLogistics() {
      Taro.navigateTo({ url: `/pages/web-view/index?url=${encodeURIComponent(this.$store.state.userInfo.mapUrl)}` })
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
          this.showToast(err)
        })
        .finally(() => {
          this.confirmBtnLoading = false
        })
    },
    addQuestion(order) {
      const { productName } = order.list[0] || {}
      Taro.navigateTo({ url: `/pages/comment/index?type=add&productName=${productName}&customerOrderCode=${order.orderNumber}` })
    },
    handleQuery() {
      Taro.navigateTo({ url: `/pages/query/index` })
    },
  },
}
</script>
