<template>
  <view class="query-page" :class="{ empty: orderList.length === 0 }">
    <view class="query-action" @tap="chooseDate"
      >{{ date || '全部' }}
      <image :src="arrow" />
    </view>
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
          <view class="product-item-content" @tap="viewOrderDetail(product)">
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
    <view class="empty" v-else>暂无数据</view>
    <view class="order-item-footer" @tap="handleChange">
      完成修改
    </view>
    <view>
      <nan-modal :visible="dateChooseVisible" v-if="dateChooseVisible" fullScreen>
        <DateChooser :dateList="dateList" @confirm="confirmDate" @cancel="cancelDate" />
      </nan-modal>
    </view>
    <Modal :visible="tipVisible" title="" cancelText="取消" confirmText="追加订单" @cancel="cancelTip" @confirm="buyAgain">
      <view style="font-size: 32rpx; padding: 24rpx;">如需增加数量，请重新下单 </view>
    </Modal>
    <view class="common-toast" v-show="errorToast.visible && errorToast.message">
      <text>{{ errorToast.message }}</text></view
    >
  </view>
</template>

<script>
import './index.less'
import Taro from '@tarojs/taro'
import { setTitle } from '@/utils'
import DateChooser from './date-chooser.vue'
import arrow from '@/images/arrow-down.png'
import Modal from '../setting/modal.vue'
import ToastMixin from '@/mixin/toast'

export default {
  mixins: [ToastMixin],
  data() {
    return {
      productList: [],
      orderList: [],
      date: '',
      dateChooseVisible: false,
      dateList: [],
      arrow,
      tipVisible: false,
      currentProduct: null,
    }
  },
  components: {
    DateChooser,
    Modal,
  },
  mounted() {
    setTitle({ title: '查询&修改' })
  },
  computed: {
    // 是否是现金用户
    isCashUser() {
      return this.$store.state.userInfo.accountType === '01'
    },
    decreaseDisabled() {
      return product => Number(product.productSum) <= Number(product.minOrderQuantity)
    },
  },

  onShow() {
    this.getProduct()
  },
  methods: {
    getProduct(type) {
      this.loading = true
      this.$API
        .listSetOrder({
          deliveryDate: this.date,
        })
        .then(data => {
          this.orderList = data || []
          this.orderList.forEach(order => {
            order.orderViews.forEach(item => {
              item.originProductSum = item.productSum
            })
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    go() {
      Taro.switchTab({ url: '/pages/product/index' })
    },
    chooseDate() {
      setTitle({ title: '选择日期' })
      this.dateChooseVisible = true
    },
    cancelDate() {
      this.dateChooseVisible = false
      setTitle({ title: '查询&修改' })
    },
    confirmDate(params) {
      this.date = params.map(v => v.weekStr.split(' ')[0]).join(',')
      this.dateChooseVisible = false
      this.getProduct()
      setTitle({ title: '查询&修改' })
    },
    viewOrderDetail(item) {
      // 区分一下当天收货
      Taro.navigateTo({
        url: `/pages/order-detail/index?order=${item.customerOrderCode}`,
      })
    },
    addProduct(product) {
      const productSum = parseInt(product.productSum) + parseInt(product.uninConvertRule)
      if (this.isCashUser) {
        if (productSum > product.originProductSum) {
          this.currentProduct = product
          this.tipVisible = true

          return
        }
      }
      product.productSum = productSum
    },
    decreaseProduct(product, index) {
      // if (this.decreaseDisabled(product)) return
      product.productSum -= parseInt(product.uninConvertRule)
      if (product.productSum <= 0) {
        product.productSum = 0
        // this.productList.splice(index, 1)
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
          this.showToast(err)
        })
      // todo
    },
    cancelTip() {
      this.tipVisible = false
      this.currentProduct = null
    },
    buyAgain() {
      if (!this.currentProduct) return
      this.$API
        .anotherOne({
          orderNumber: this.currentProduct.customerOrderCode,
        })
        .then(() => {
          Taro.switchTab({ url: '/pages/shop/index' })
        })
        .catch(err => {
          this.showToast(err)
        })
    },
  },
}
</script>
