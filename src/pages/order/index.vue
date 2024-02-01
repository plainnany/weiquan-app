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
                  <view class="flex-between-center product-item">
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
                  <view class="flex-between-center product-item" v-for="(product, pIndex) in order.orderListViews" :key="pIndex">
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
                    <view class="order-result-number">
                      <view>订单量:{{ product.productSum }}</view>
                      <view v-if="product.state === '05'">实收量:{{ product.logisticsSum || '0' }}</view>
                      <view class="order-result-type">{{
                        /01/.test(product.state) && userInfo.accountType === '01' ? '' : STATE_TYPE[product.state]
                      }}</view>
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
                    <view class="btn-plain" @tap.stop="handleDelivery(order, '01')" v-if="order.deliveryFlg === '01'">收货单</view>
                    <view class="btn-plain" @tap.stop="handleDelivery(order, '02')" v-if="order.returnFlg === '01'">退货单</view>
                    <view class="btn-plain" @tap.stop="buyAgain(order)">再下一单</view>
                    <view class="flex-between-center" v-if="order.state === '01'">
                      <view class="btn-plain" @tap.stop="handleCancelOrder(order)">取消订单</view>
                      <view class="btn-primary" @tap.stop="handlePay(order)">立即支付</view>
                    </view>
                    <view v-if="order.state === '05'" class="btn-primary" @tap.stop="addQuestion(order)">问题反馈</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <Modal
        :visible="cancelDialog.visible"
        v-if="cancelDialog.visible"
        :title="cancelDialog.title"
        cancelText="放弃"
        confirmText="取消订单"
        @cancel="() => (cancelDialog = {})"
        @confirm="cancelOrder(cancelDialog.order)"
      >
        <view>{{ cancelDialog.content }}</view>
      </Modal>
    </view>
    <view v-if="payDialogVisible" class="order-pay-modal">
      <view :class="['order-pay-modal-wrap']" @tap="() => (payDialogVisible = false)"></view>
      <view :class="['order-pay-modal-wrapper']">
        <view class="order-pay">
          <!-- 头部 -->
          <view class="order-pay-title">
            <view style="color: #fa4a2d">支付金额 {{ userInfo.dianZhang ? `¥${payData.total_fee}` : '****' }}</view>
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
    <view class="common-toast" v-show="errorToast.visible && errorToast.message">
      <text>{{ errorToast.message }}</text></view
    >
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
import Modal from '../setting/modal.vue'
import ToastMixin from '@/mixin/toast'

export default {
  components: {
    Modal,
  },
  mixins: [ToastMixin],
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
      // "state":"01待付款;02,03待发货，04:当天收货05:已完成",
      //
      STATE_TYPE: {
        '01': '待付款',
        '02': '待发货',
        '03': '待发货',
        '04': '当天收货',
        '05': '已完成',
        '09': '异常订单',
      },

      pageNo: 1,
      complete: false,
      loading: false,
      hasGetOrder: false,
      payDialogVisible: false,
      payData: {},
      payMethod: 'weixin-pocket',
      btnLoading: false,
      delivery: [], // 当日收货订单列表
      phone: '', // 当前收货的手机号
      confirmBtnLoading: false,
      previewImg: '',
      showTipModal: false,
      cancelDialog: {
        visible: false,
      },
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
    initPayMethod() {
      if (this.userInfo.accountType === '02' || !this.userInfo.dianZhang) {
        this.payMethod = 'weixin-2'
        return 'weixin-2'
      }

      return 'weixin-pocket'
    },
  },
  onShareAppMessage() {
    return {
      title: '老板，订货请支付！',
      path: `/pages/web-view/index?url=${encodeURIComponent(this.payData.wechatUrl)}`,
      imageUrl: 'http://foodservice-main.oss-cn-hangzhou.aliyuncs.com/kd/fx.png',
      // promise,
    }
  },
  onShow() {
    const params = this.$instance.router.params
    const { type } = params
    if (type) {
      this.activeTab = type
    }
    this.getOrder({ type: 'all' })
  },
  created() {
    this.$instance = Taro.getCurrentInstance()
  },
  mounted() {
    setTitle({ title: '我的订单' })
  },
  methods: {
    clickTab({ key }) {
      this.activeTab = key
      this.pageNo = 1
      this.complete = false
      wx.redirectTo({ url: `/pages/order/index?type=${key}` })
      // this.getOrder()
    },
    getOrder({ isLoadMore }) {
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
      this.getOrder({ isLoadMore: true })
    },
    handleCancelOrder(order) {
      this.cancelDialog = {
        title: '删除订单',
        content: '一旦取消订单，将不再显示？',
        visible: true,
        order,
      }
    },
    cancelOrder(order) {
      this.$API
        .deleteOrder({
          mainOrderNumber: order.orderNumber,
        })
        .then(data => {
          this.cancelDialog = {}
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
    onPayMethodChange(e) {
      this.payMethod = e.detail.value
    },
    cancelModal() {
      this.showTipModal = false
    },
    handleConfirm() {
      if (this.payMethod === 'company-pocket') {
        this.showTipModal = true
      } else {
        this.confirmPay()
      }
    },
    confirmPay() {
      if (this.payMethod === 'weixin-pocket' || this.payMethod === 'company-pocket') {
        this.btnLoading = true
        const method = {
          'weixin-pocket': 'balancePayment',
          'company-pocket': 'balanceParentPayment',
        }[this.payMethod]
        this.$API[method]({
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
            this.showToast(err)
          })
      } else if (this.payMethod === 'weixin') {
        // 如果是微信支付，SurplusPage=01 跳转中间支付倒计时页面，然后拉起微信小程序支付
        // 否则，直接拉起微信小程序支付
        const unionId = Taro.getStorageSync('unionId')
        this.$API
          .unifiedorder({
            _data: JSON.stringify({
              out_trade_no: this.payData.out_trade_no,
              total_fee: this.payData.total_fee,
            }),
            openid: unionId,
          })
          .then(data => {
            this.hideModal()
            if (data.surplusPage === '01') {
              Taro.navigateTo({
                url: `/pages/pay-countdown/index?orderNumber=${this.payData.orderNumber}&tradeNumber=${this.payData.out_trade_no}`,
              })
            } else {
              wx.requestPayment({
                ...data,
                appId: data.appid,
                package: data.packageStr,
                success: res => {
                  Taro.redirectTo({ url: '/pages/order/index?type=all' })
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
    },
    hideModal() {
      this.payMethod = ''
      this.payDialogVisible = false
    },
    viewOrderDetail(orderNumber) {
      // 区分一下当天收货
      Taro.navigateTo({
        url: `/pages/order-detail/index?order=${orderNumber}&type=${this.activeTab}`,
      })
    },
    contact() {
      if (!this.phone) return
      Taro.makePhoneCall({
        phoneNumber: this.phone,
      })
    },
    // 查看物流
    viewLogistics() {
      Taro.navigateTo({ url: `/pages/web-view/index?url=${encodeURIComponent(this.$store.state.userInfo.mapUrl)}` })
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
          this.showToast(err)
        })
        .finally(() => {
          this.confirmBtnLoading = false
        })
    },
    buyAgain(order) {
      this.$API
        .anotherOne({
          orderNumber: order.orderNumber,
        })
        .then(() => {
          Taro.switchTab({ url: '/pages/shop/index' })
        })
        .catch(err => {
          this.showToast(err)
        })
    },
    addQuestion(order) {
      const { productName } = order.orderListViews[0] || {}
      Taro.navigateTo({ url: `/pages/comment/index?type=add&productName=${productName}&customerOrderCode=${order.orderNumber}` })
    },
    // 收货单 01，退货单 02
    handleDelivery(item, type) {
      this.$API
        .getDT({
          orderNumber: item.orderNumber,
          type,
        })
        .then(data => {
          this.previewImg = data.imgUrl
          Taro.navigateTo({ url: `/pages/image-preview/index?imageUrl=${data.imgUrl}` })
        })
    },
  },
}
</script>
