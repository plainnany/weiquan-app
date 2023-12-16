<template>
  <view class="order-detail">
    <view class="order-detail-type">
      <view class="order-detail-type-title">{{ STATE_TYPE_TEXT[orderDetail.state].title }}</view>
      <view class="order-detail-type-sub-title">{{ STATE_TYPE_TEXT[orderDetail.state].subTitle }}</view>
      <view class="order-detail-status"> <image :src="STATE_TYPE_TEXT[orderDetail.state].icon" mode=""/></view>
      <view v-if="orderDetail.state === STATE_TYPE.toPay">9分钟后订单关闭，请及时付款哦</view>
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
              <view>{{ userInfo.customerAddress }} </view>
            </view>
            <view class="phone">{{ userInfo.customerLinkTel }}</view>
          </view>
        </view>
        <view class="flex-between-center">
          <view class="order-detail-location">
            <image :src="driverIcon" mode="" class="driver" />
          </view>
          <view class="order-detail-location-info">
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
      <view v-for="(product, index) in orderDetail.list" :key="index">
        <view class="common-card">
          <view class="order-detail-item flex-between-center">
            <view class="flex-between-center">
              <view class="order-detail-image">
                <image :src="product.productImage" mode="" />
              </view>
              <view class="order-detail-info">
                <view>{{ product.productName }}</view>
                <view class="grey">{{ product.productSpecs }} {{ product.specifications }}</view>
                <view class="order-detail-tag"
                  ><text>{{ ORDER_TYPE[product.orderType] }}</text>
                  <text class="green" v-if="product.deliveryRepair === '01'">补验收</text>
                </view>
                <view class="grey">交货时间：{{ product.deliveryDate }}</view>
              </view>
            </view>
            <view>
              <view class="order-detail-price" v-if="product.price"
                >¥ <text>{{ product.price }}</text></view
              >
              <view>订单量 {{ product.productSum }}</view>
              <view v-if="product.state === '05'">实收量 {{ product.logisticsSum || '0' }}</view>
            </view>
          </view>
        </view>
        <!-- <view class="common-card">
          <view class="flex-between-center">
            <text class="order-detail-color-grey">商品小计</text>
            <view class="order-detail-sum"
              >¥ <text>{{ product.price }}</text></view
            >
          </view>
          <view class="flex-between-center">
            <text class="order-detail-color-grey">活动优惠</text>
            <view class="order-detail-sum"
              >-¥ <text>{{ '7' }}</text></view
            >
          </view>
          <view class="flex-between-center order-detail-total">
            <text>应付金额合计</text>
            <view class="order-detail-sum"
              >¥ <text>{{ '31.8' }}</text></view
            >
          </view>
        </view> -->
      </view>
      <view class="common-card">
        <view class="order-detail-item">
          <text class="order-detail-color-grey">订单编号：</text>
          <text class="order-detail-color-grey">{{ orderDetail.customerOrderCode }}</text>
        </view>
        <view class="order-detail-item">
          <text class="order-detail-color-grey">下单时间：</text>
          <text class="order-detail-color-grey">{{ orderDetail.createDate }}</text>
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
    </view>
    <view class="order-detail-footer flex-between-center" v-if="orderDetail.state === STATE_TYPE.toPay">
      <view></view>
      <view class="flex-between-center">
        <nan-button type="plain" @tap="cancelOrder">取消订单</nan-button>
        <nan-button type="primary" @tap="handlePay">去支付</nan-button>
      </view>
    </view>
    <view v-if="payDialogVisible" class="order-pay-modal">
      <view :class="['order-pay-modal-wrap']"></view>
      <view :class="['order-pay-modal-wrapper']">
        <view class="order-pay">
          <!-- 头部 -->
          <view class="order-pay-title">
            <view>支付金额{{ payData.total_fee }}</view>
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
                    <text v-if="payItem.method === 'weixin-pocket'"> (¥{{ userInfo.accoutBalance }}) </text>
                  </view>
                </view>
                <view>
                  <radio :value="payItem.method" :checked="payItem.method === payMethod" color="#fa4a2d" />
                </view>
              </label>
            </radio-group>
          </view>
          <view class="order-pay-footer">
            <nan-button type="primary" :disabled="!payMethod" :loading="btnLoading" @tap="confirmPay">确认支付</nan-button>
          </view>
        </view>
      </view>
    </view>
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
      // "state":"01待付款;02,03,04:待发货05:已完成",
      STATE_TYPE: {
        toPay: '01',
        toDeliver: '02',
        toDeliver: '03',
        toDeliver: '04',
        done: '05',
      },
      STATE_TYPE_TEXT: {
        '01': {
          title: '待付款',
          subTitle: '待付款',
          icon: orderDetailPayIcon,
        },
        '02': {
          title: '等待发货',
          subTitle: '买家已下单，等待卖家发货',
          icon: orderDetailIcon,
        },
        '03': {
          title: '等待发货',
          subTitle: '买家已下单，等待卖家发货',
          icon: orderDetailIcon,
        },
        '04': {
          title: '等待发货',
          subTitle: '买家已下单，等待卖家发货',
          icon: orderDetailIcon,
        },
        '05': {
          title: '已完成',
          subTitle: '订单已完成',
          icon: orderDetailEndIcon,
        },
      },
      payDialogVisible: false,
      payData: {},
      payMethod: '',
      payList: [
        {
          method: 'weixin-pocket',
          name: '余额支付',
          icon: weipocketIcon,
        },
        {
          method: 'weixin',
          name: '微信支付',
          icon: wechatIcon,
        },
      ],
      btnLoading: false,
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  mounted() {
    setTitle({ title: '我的订单' })
  },
  onShow() {
    const { order } = Taro.getCurrentInstance().router.params
    this.getOrder(order)
  },
  methods: {
    clickTab({ key }) {
      this.activeTab = key
    },
    getOrder(orderNumber) {
      this.$API
        .getOrderDetail({
          // orderNumber: '2022091920365617123456789',
          orderNumber,
        })
        .then(data => {
          this.orderDetail = data
          console.log(data)
        })
    },
    viewDeliver() {},
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
      if (this.payMethod === 'weixin-pocket') {
        this.btnLoading = true
        this.$API
          .balancePayment({
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
      Taro.makePhoneCall({
        phoneNumber: this.orderDetail.driverTel,
      })
    },
  },
}
</script>
