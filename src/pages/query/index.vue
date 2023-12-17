<template>
  <view class="query-page" :class="{ empty: orderList.length === 0 }">
    <view class="query-page-tip">
      温馨提示: 在线支付客户操作订单减少, 货款会立即退还至您的账户余额, 如需操作订单增加,请重新下单支付.
    </view>
    <view class="order-wrapper" v-if="orderList.length > 0">
      <view v-for="(order, index) in orderList" :key="index" class="order-item">
        <view class="order-item-date"> 交货日期: {{ order.deliveryDate }} </view>
        <view class="product-item" v-for="(product, i) in order.orderViews || []" :key="i">
          <view class="product-item-image">
            <image :src="product.productImage" mode="" />
          </view>
          <view class="product-item-content" @tap="onClick(product)">
            <view class="product-item-title">{{ product.productName }}</view>
            <view class="product-item-info"> {{ product.productSpecs }} {{ product.specifications }}</view>
            <view class="product-item-date">
              <view>
                {{ product.productTime }}
              </view>
              <view class="product-detail-number">
                <view class="product-action-btn" @tap.stop="decreaseProduct(product, index)">-</view>
                <input
                  type="number"
                  v-model="product.productSum"
                  @tap.stop="() => {}"
                  @focus.stop="() => {}"
                  @blur.stop="onBlur(product)"
                  placeholder="请输入数量"
                />
                <view class="product-action-btn" @tap.stop="addProduct(product)">+</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="empty">暂无数据</view>
    <view class="order-item-footer" v-if="orderList.length > 0" @tap="handleChange">
      完成修改
    </view>
  </view>
</template>

<script>
import './index.less'
import Taro from '@tarojs/taro'
import { setTitle } from '@/utils'

export default {
  data() {
    return {
      productList: [],
      orderList: [],
    }
  },
  components: {},
  mounted() {
    setTitle({ title: '查询&修改' })
  },
  computed: {},

  onShow() {
    this.getProduct()
  },
  methods: {
    getProduct(type) {
      this.loading = true
      this.$API
        .listSetOrder()
        .then(data => {
          this.orderList = data || []
        })
        .finally(() => {
          this.loading = false
        })
    },
    go() {
      Taro.switchTab({ url: '/pages/product/index' })
    },
    addProduct(product) {
      product.productSum = parseInt(product.productSum) + parseInt(product.minOrderQuantity)
    },
    decreaseProduct(product, index) {
      product.productSum -= parseInt(product.minOrderQuantity)
      if (product.productSum <= 1) {
        this.productList.splice(index, 1)
        return
      }
    },
    onBlur(product) {
      if (!product.productSum) return
      product.productSum = parseInt(product.productSum)
    },
    handleChange() {
      const list = this.orderList
        .flatMap(v => v.orderViews)
        .map(v => ({
          amount: v.productSum,
          orderCode: v.orderCode,
        }))
      const params = {
        flg: '01',
        json: JSON.stringify(list),
      }

      this.$API
        .updateOrder(params)
        .then(res => {
          Taro.switchTab({ url: '/pages/user/index' })
        })
        .catch(err => {
          Taro.showToast({
            title: err.msg,
            icon: 'error',
          })
        })
      // todo
    },
  },
}
</script>
