<template>
  <view class="confirm-order">
    <view class="common-card flex">
      <view class="flex">
        <view class="confirm-order-location">
          <image :src="locationIcon" mode="" />
        </view>
        <view class="confirm-order-location-info">
          <view>{{ userInfo.customerLinkMan }} {{ userInfo.customerLinkTel }}</view>
          <view>{{ userInfo.customerAddress }} </view>
        </view>
      </view>
      <!-- <view class="confirm-order-nav">
        <image :src="backIcon" mode="" />
      </view> -->
    </view>
    <view v-for="product in productList" :key="product.productId">
      <view class="common-card">
        <view class="delivery-date" @tap="chooseDate(product)">
          <view style="color: #666">
            配送时间
          </view>
          <view class="confirm-order-nav">
            <image :src="backIcon" mode="" />
          </view>
        </view>
        <!-- 批量 有搭赠单 -->
        <view class="delivery-date-item" v-if="isBatchOrder" v-for="(item, index) in product.weekStr || []" :key="item">
          <view class="flex-between-center donate">
            <view>{{ item }}</view>
            <view class="flex-between-center" v-if="product.donateList && product.donateList[index] && product.donateList[index].img">
              <view class="donate-img">
                <image :src="product.donateList[index].img" mode="" />
              </view>
              <view class="donate-num">X {{ product.donateList[index].num }}</view>
              <view class="donate-tag">搭赠单</view>
            </view>
          </view>
        </view>
        <!-- 单个 -->
        <view class="delivery-date-item is-single" v-else v-for="(item, index) in product.weekStr || []" :key="item">
          <view class="flex-between-center donate">
            <view>{{ item }}</view>
          </view>
        </view>
        <view class="confirm-order-item flex">
          <view class="flex">
            <view class="confirm-order-image">
              <image :src="product.productImage" mode="" />
            </view>
            <view class="confirm-order-info">
              <view>{{ product.productName }}</view>
              <view>规格：{{ product.productSpecs }} </view>
              <view>单位：1 {{ product.productUnitMax }} / 数量：{{ product.productUnitConvertRule }}</view>
              <!-- <view class="confirm-order-tag"
              ><text>{{ product.type }}</text></view
            > -->
            </view>
          </view>
          <view class="confirm-order-price">
            <view v-show="showPrice" style="display: flex"
              >¥ <text>{{ Number(product.total).toFixed(2) }}</text></view
            >
            <view>X {{ product.amount }}</view>
          </view>
        </view>
        <view class="flex-between-center" v-if="product.donateList && product.donateList[0] && product.donateList[0].img && !isBatchOrder">
          <view class="flex-between-center">
            <view class="donate-img">
              <image :src="product.donateList[0].img" mode="" />
            </view>
            <view class="donate-num">X {{ product.donateList[0].num }}</view>
          </view>
          <view class="donate-tag">搭赠单</view>
        </view>
      </view>
    </view>
    <view class="confirm-order-footer">
      <view class="total" v-if="showPrice">¥ {{ deliverTime ? totalFee : 0 }}</view>
      <view class="confirm-order-btn" @tap="confirmOrder">立即结算</view>
    </view>
    <view>
      <nan-modal :visible="dateChooseVisible" v-if="dateChooseVisible" fullScreen>
        <DateChooser :productCode="productCode" :isBatchOrder="isBatchOrder" @confirm="confirmDate" @cancel="cancelDate" />
      </nan-modal>
    </view>
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'
import locationIcon from '@/images/location-2.png'
import backIcon from '@/images/user/back.png'
import Taro from '@tarojs/taro'
import DateChooser from './date-chooser.vue'

export default {
  components: { DateChooser },
  data() {
    return {
      productList: [],
      locationIcon,
      backIcon,
      params: {},
      userInfo: {},
      deliverTime: '',
      productCode: '',
      dateChooseVisible: false,
      isBatchOrder: false,
      currentProduct: null,
      totalFee: '',
    }
  },
  computed: {
    // totalFee() {
    //   // 此金额需要调用后端接口计算,/api/v2/order/v2/getAmount.ns
    //   return this.productList.reduce((prev, cur) => prev + parseFloat(cur.total), 0)
    // },
    showPrice() {
      return this.$store.state.userInfo.showPrice
    },
  },
  mounted() {
    setTitle({ title: '确认订单' })
    this.userInfo = this.$store.state.userInfo
  },
  onShow() {
    const instance = Taro.getCurrentInstance()
    this.params = instance.router.params
    this.deliverTime = this.params.date || ''
    this.isBatchOrder = this.params.type === 'batch'
    console.log(this.params)
    this.getDetail()
  },
  methods: {
    getDetail() {
      let params = {}
      if (this.params.type === 'batch') {
        params = {
          productId: this.params.productId,
          sum: this.params.sum,
        }
      } else {
        params = {
          shopIds: this.params.shopIds,
        }
      }

      this.$API.paySettlement(params).then(data => {
        if (data) {
          this.productList = data
        }
      }).catch
    },
    chooseDate(product) {
      this.productCode = product.productCode
      this.dateChooseVisible = true
      setTitle({ title: '日期' })
    },
    confirmDate(params) {
      const deliverTime = params.map(v => v.weekStr.split(' ')[0]).join(',')
      const weekStr = params.map(v => v.weekStr)
      this.deliverTime = deliverTime
      this.productList.forEach(product => {
        if (product.productCode === this.productCode) {
          product.deliverTime = deliverTime
          this.$set(product, 'deliverTime', deliverTime)
          this.$set(product, 'weekStr', weekStr)
        }
      })
      let param = {}
      if (this.isBatchOrder) {
        const product = this.productList[0] || {}
        param = {
          amount: product.amount,
          productId: product.productId,
          deliverTime: product.deliverTime,
          deliverTimeState: '01',
        }
      } else {
        const json = JSON.stringify(
          this.productList.map(product => ({
            shopCarId: product.oid,
            deliverTime: product.deliverTime,
            deliverTimeState: '01',
          }))
        )
        param = { json }
      }

      this.$API.getAmount(param).then(data => {
        this.totalFee = data.sum
        this.productList.forEach(product => {
          if (product.productCode === this.productCode) {
            if (data.list && data.list.length > 0) {
              this.$set(product, 'donateList', data.list)
            }
          }
        })
      })
      this.dateChooseVisible = false
      setTitle({ title: '确认订单' })
    },
    cancelDate() {
      this.dateChooseVisible = false
      setTitle({ title: '确认订单' })
    },
    confirmOrder() {
      const hasNotDeliverTime = this.productList.some(v => !v.deliverTime)
      if (hasNotDeliverTime) {
        Taro.showToast({
          title: '请选择配送时间',
          icon: 'error',
        })
        return
      }
      if (this.params.type === 'batch') {
        const product = this.productList[0]
        this.$API
          .submitBatchOrder({
            deliverTimeState: '01',
            deliverTimeStr: product.deliverTime,
            productId: product.productId,
            amount: product.amount,
          })
          .then(data => {
            this.handleResult(data)
          })
      } else if (this.params.shopIds) {
        const shopCardList = this.productList.map(product => ({
          shopCarId: product.oid,
          deliverTime: product.deliverTime,
        }))
        const json = JSON.stringify(shopCardList)
        this.$API
          .createOrder({
            json,
          })
          .then(data => {
            this.handleResult(data)
          })
      }
    },
    handleResult(data) {
      if (data && data.accountType === '02') {
        Taro.navigateTo({ url: '/pages/order/index?type=done' })
      } else if (data.pay) {
        Taro.navigateTo({
          url: `/pages/order-settle/index?number=${data.pay.orderNumber}&money=${data.pay.total_fee}&trade=${data.pay.out_trade_no}&payUrl=${data.pay.wechatUrl}`,
        })
      }
    },
  },
}
</script>
