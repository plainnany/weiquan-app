<template>
  <view>
    <view class="order-page">
      <view class="order-tabs">
        <view class="order-tab" :class="{ active: activeTab === tab.key }" v-for="tab in tabs" :key="tab.key" @tap="clickTab(tab)">{{
          tab.title
        }}</view>
      </view>
      <view class="order-result">
        <view class="order-result-empty" v-if="showEmpty">
          <view class="order-result-empty-text">
            暂无数据
          </view>
        </view>
        <scroll-view :scroll-y="true" @scrolltolower="toLower" v-else>
          <view class="order-result-list" v-if="activeTab === 'to-delivery'">
            <view class="common-card">
              <view class="order-result-title">
                <view @tap="contact" class="contact"
                  >联系配送员
                  <image :src="phoneCallIcon" class="phone-call" mode="" />
                </view>
                <text class="contact">当日发货</text>
              </view>
              <view
                class="order-result-content"
                v-for="(product, pIndex) in delivery"
                :key="pIndex"
                @tap="viewOrderDetail(product.customerOrderCode)"
              >
                <view class="flex-between-center order-result-item ">
                  <view class="flex-between-center">
                    <view class="order-result-image">
                      <image :src="product.productImage" mode="" />
                    </view>
                    <view class="order-result-info">
                      <view>{{ product.productName }}</view>
                      <view>{{ product.productSpecs }} {{ product.specifications }}</view>
                      <view class="order-result-tag">
                        <text :class="colorMap[product.orderType]">{{ ORDER_TYPE[product.orderType] }}</text>
                        <text class="green" v-if="product.deliveryRepair === '01'">补验收</text>
                      </view>
                    </view>
                  </view>
                  <view>
                    <view>{{ product.productSum }}</view>
                  </view>
                </view>
              </view>
              <view class="flex-between-center order-result-footer">
                <text>共{{ delivery.length }}件商品</text>
                <!-- 待支付 -->
                <view class="flex-between-center">
                  <nan-button type="plain" @tap="viewLogistics" class="normal">查看物流</nan-button>
                  <nan-button type="primary" @tap="confirmDelivery" :loading="confirmBtnLoading" class="normal">确认收货</nan-button>
                </view>
              </view>
            </view>
          </view>
          <view class="order-result-list" v-else>
            <view class="common-card" v-for="(order, index) in orderList" :key="index" @tap="viewOrderDetail(order.orderNumber)">
              <view class="order-result-title">
                <text>订单号 {{ order.orderNumber }}</text>
                <!-- <text class="order-result-type">{{ STATE_TYPE[order.state] }}</text> -->
              </view>
              <view class="order-result-content">
                <!-- <view class="order-result-deliver flex-between-center" @tap="viewDeliver(order)">
                <view class="flex-between-center">
                  <image :src="carIcon" mode="" />
                  <view class="order-result-deliver-info">
                    <view>[北京市] [北京综合邮件处理中心]，下一站，下一站，下一站</view>
                    <view>2021.12.28 10:31:11</view>
                  </view>
                </view>
                <view>
                  <image :src="backIcon" mode="" />
                </view>
              </view> -->
                <view class="order-result-item ">
                  <view class="flex-between-center" v-for="(product, pIndex) in order.orderListViews" :key="pIndex">
                    <view class="flex-between-center">
                      <view class="order-result-image">
                        <image :src="product.productImage" mode="" />
                      </view>
                      <view class="order-result-info">
                        <view>{{ product.productName }}</view>
                        <view>{{ product.productSpecs }} {{ product.specifications }}</view>
                        <view class="order-result-tag">
                          <text :class="colorMap[product.orderType]">{{ ORDER_TYPE[product.orderType] }}</text>
                          <text class="green" v-if="product.deliveryRepair === '01'">补验收</text>
                        </view>
                        <view class="order-date">交货时间 {{ product.deliveryDate }}</view>
                      </view>
                    </view>
                    <view>
                      <view>订单量 {{ product.productSum }}</view>
                      <view v-if="product.state === '05'">实收量 {{ product.logisticsSum || '0' }}</view>
                      <view class="order-result-type">{{ STATE_TYPE[product.state] }}</view>
                    </view>
                  </view>
                </view>
                <view class="flex-between-center order-result-footer">
                  <text>共{{ order.orderListViews.length }}件商品</text>
                  <!-- 待支付 -->

                  <!-- 已付款 -->
                  <!-- <view class="flex-between-center" v-if="order.state === '02'">
                    <nan-button type="plain">取消订单</nan-button>
                    <nan-button type="primary">提醒发货</nan-button>
                  </view> -->
                  <!-- 待发货 -->
                  <!-- <view class="flex-between-center" v-if="order.state === '03'">
                    <nan-button type="plain">取消订单</nan-button>
                    <nan-button type="primary">提醒发货</nan-button>
                  </view> -->
                  <!--  -->
                  <view class="flex-between-center">
                    <view class="btn-plain" @tap="buyAgain">再下一单</view>
                    <view class="flex-between-center" v-if="order.state === '01'">
                      <view class="btn-plain" @tap="cancelOrder(order)">取消订单</view>
                      <view class="btn-primary" @tap="handlePay(order)">立即支付</view>
                    </view>
                    <view v-if="order.state === '05'" class="btn-primary" @tap="addQuestion(order)">问题反馈</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
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
import orderEmptyIcon from '@/images/order-empty.png'
import carIcon from '@/images/car.png'
import backIcon from '@/images/user/back.png'
import Taro from '@tarojs/taro'
import wechatIcon from '@/images/wechat.png'
import weipocketIcon from '@/images/wei-pocket.png'
import closeIcon from '@/images/close.png'
import phoneCallIcon from '@/images/phone-call.png'

export default {
  components: {},
  data() {
    return {
      activeTab: 'all',
      tabs: [
        {
          title: '全部',
          key: 'all',
          method: 'getAllOrder',
        },
        {
          title: '待付款',
          key: 'to-pay',
          method: 'getPendingPayment',
        },
        {
          title: '待发货',
          key: 'to-receive',
          method: 'getWaitDelivery',
        },
        {
          title: '当天收货',
          key: 'to-delivery',
          method: 'todayDeliveryOrder',
        },
        {
          title: '已完成',
          key: 'done',
          method: 'getAlreadyCompleted',
        },
      ],
      orderList: [],
      orderEmptyIcon,
      phoneCallIcon,
      carIcon,
      backIcon,
      closeIcon,
      ORDER_TYPE: {
        '01': '正常单',
        '02': '样品单',
        '03': '搭赠单',
      },
      colorMap: {
        '01': '',
        '02': 'sample',
        '03': 'gift',
      },
      // "state":"01待付款;02,03,04:待发货05:已完成",
      //
      STATE_TYPE: {
        '01': '待付款',
        '02': '待发货',
        '03': '待发货',
        '04': '待发货',
        '05': '已完成',
      },

      pageNo: 1,
      complete: false,
      loading: false,
      hasGetOrder: false,
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
      wrapAnimate: 'wrapAnimate',
      frameAnimate: 'frameAnimate',
      btnLoading: false,
      delivery: [], // 当日收货订单列表
      phone: '', // 当前收货的手机号
      confirmBtnLoading: false,
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    showEmpty() {
      if (this.activeTab === 'to-delivery') {
        return !this.delivery.length && this.hasGetOrder
      }
      return !this.orderList.length && this.hasGetOrder
    },
  },
  created() {
    this.$instance = Taro.getCurrentInstance()
  },
  mounted() {
    setTitle({ title: '我的订单' })
    const params = this.$instance.router.params
    const { type } = params
    if (type) {
      this.activeTab = type
    }
    this.getOrder({ type: 'all' })
  },
  methods: {
    clickTab({ key }) {
      this.activeTab = key
      this.pageNo = 1
      this.complete = false
      this.getOrder()
    },
    getOrder(isLoadMore) {
      const method = this.tabs.find(tab => tab.key === this.activeTab).method
      this.loading = true
      this.$API[method]({
        pageNo: this.pageNo,
        limit: 10,
      })
        .then(res => {
          const data = res || []
          if (this.activeTab === 'to-delivery') {
            this.delivery = res.delivery || []
            this.phone = (res.phone || [])[0]
          } else if (isLoadMore) {
            this.orderList = this.orderList.concat(data)
          } else {
            this.orderList = data
          }

          if (data.length === 0) {
            this.complete = true
          }
        })
        .finally(() => {
          this.loading = false
          this.hasGetOrder = true
        })
    },
    viewDeliver() {},
    toLower() {
      if (this.loading || this.complete) {
        return
      }
      this.pageNo++
      this.getOrder(true)
    },
    cancelOrder(order) {
      this.$API
        .deleteOrder({
          mainOrderNumber: order.orderNumber,
        })
        .then(data => {
          const index = this.orderList.findIndex(v => v.orderNumber === order.orderNumber)
          if (index > -1) {
            this.orderList.splice(index, 1)
          }
        })
    },
    handlePay(order) {
      this.$API
        .orderPay({
          orderNumber: order.orderNumber,
        })
        .then(data => {
          if (data) {
            this.payData = data
            this.showModal()
          }
        })
      // const money = order.orderListViews.reduce((prev, cur) => prev + parseFloat(cur.price) * parseInt(cur.productSum), 0)
      // Taro.navigateTo({ url: `/pages/order-settle/index?number=${order.orderNumber}&money=${money}` })
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
              const index = this.orderList.findIndex(v => v.orderNumber === this.payData.orderNumber)
              if (index > -1) {
                this.orderList.splice(index, 1)
              }
              Taro.showToast({
                title: '支付成功',
                icon: 'success',
              })
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
      // this.wrapAnimate = 'wrapAnimate'
      // this.frameAnimate = 'frameAnimate'
    },
    hideModal() {
      // this.wrapAnimate = 'wrapAnimateOut'
      // this.frameAnimate = 'frameAnimateOut'
      this.payMethod = ''
      this.payDialogVisible = false
      // setTimeout(() => {
      //   this.payDialogVisible = false
      // }, 400)
    },
    viewOrderDetail(orderNumber) {
      Taro.navigateTo({
        url: `/pages/order-detail/index?order=${orderNumber}`,
      })
    },
    contact() {
      Taro.makephoneCallIcon({
        phoneNumber: this.phone,
      })
    },
    // 查看物流
    viewLogistics() {
      Taro.navigateTo({ url: `/pages/web-view/index?url=${this.$store.state.userInfo.mapUrl}` })
    },
    // 确认收货
    confirmDelivery() {
      this.confirmBtnLoading = true
      const json = this.delivery.map(v => ({ orderCode: v.orderCode, amount: v.productSum, minOrderQuantity: v.configSum }))
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
    buyAgain() {
      Taro.switchTab({ url: '/pages/shop/index' })
    },
    addQuestion(order) {
      const { productName } = order.orderListViews[0] || {}
      Taro.navigateTo({ url: `/pages/comment/index?productName=${productName}` })
    },
  },
}
</script>
