<template>
  <view class="shop-page" :class="{ empty: productList.length === 0 }">
    <scroll-view v-if="productList.length" class="shop-product-wrapper" scroll-y="true" @scrolltolower="toLower">
      <view class="edit" @tap="handleEdit">{{ edit ? '完成' : '编辑' }}</view>
      <view v-for="(product, index) in productList" :key="index" class="shop-product-item">
        <view class="border">
          <checkbox :checked="product.checked" @tap.stop="change(product, index)"></checkbox>
          <view class="shop-product-image">
            <image :src="product.productImage" mode="" />
          </view>
          <view class="shop-product-detail-edit" v-if="edit">
            <view class="shop-product-detail-edit-number">
              <view
                class="product-edit-action-btn"
                :class="{ disable: decreaseDisabled(product) }"
                @tap.stop="decreaseProduct(product, index)"
                >-</view
              >
              <input
                type="number"
                v-model="product.amount"
                @tap.stop="() => {}"
                @focus.stop="() => {}"
                @blur.stop="onBlur(product)"
                placeholder="请输入数量"
              />
              <view class="product-edit-action-btn" @tap.stop="addProduct(product)">+</view>
            </view>
            <view class="product-delete" @tap.stop="deleteProduct(product, index)">删除</view>
          </view>
          <view class="shop-product-detail" v-else>
            <view class="shop-product-content" @tap="onClick(product)">
              <view class="shop-product-detail-title">{{ product.productName }}</view>
              <view class="shop-product-detail-info">规格: {{ product.productSpecs }}</view>
              <view class="shop-product-detail-info"
                >单位: {{ 1 }}{{ product.productUnitMax }}/数量:{{ product.productUnitConvertRule }}</view
              >
            </view>
            <view class="shop-product-price">
              <view class="shop-product-detail-price" v-show="product.price && userInfo.accountType !== '02'"
                >¥ <text>{{ (Number(product.price) * Number(product.amount)).toFixed(2) }}</text></view
              >
              <view class="shop-product-detail-number">
                <view class="product-action-btn" :class="{ disable: decreaseDisabled(product) }" @tap.stop="decreaseProduct(product, index)"
                  >-</view
                >
                <!-- <text @tap.stop="">{{ product.amount }}</text> -->
                <input
                  type="number"
                  v-model="product.amount"
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
    </scroll-view>
    <view v-else class="shop-empty">
      暂无数据
      <!-- <view class="shop-empty-title">购物车空空如也</view>
      <view class="shop-empty-tip">赶紧慰劳一下自己吧</view>
      <view class="shop-empty-btn">
        <button @tap="go">去逛逛</button>
      </view> -->
    </view>
    <view class="shop-product-footer">
      <view class="left">
        <checkbox :checked="checkAll" @tap="handleCheckAll">全选</checkbox>
      </view>
      <view style="display: flex; align-items: center">
        <!-- <view v-if="total > 0"
          >合计: ¥<text class="shop-product-total">{{ total }}</text></view
        > -->
        <button @tap.stop="edit ? handleDelete() : handleSettle()">{{ edit ? '删除' : '结算' }}({{ checkedNum }})</button>
      </view>
    </view>
    <Modal :visible="visible" title="删除" cancelText="取消" confirmText="确认" @cancel="() => (visible = false)" @confirm="confirmDelete">
      <view style="font-size: 28rpx">确定要删除该商品么？</view>
    </Modal>
  </view>
</template>

<script>
import './index.less'
import Taro from '@tarojs/taro'
import Modal from '../setting/modal.vue'

export default {
  data() {
    return {
      msg: '',
      productList: [],
      checked: false,
      checkAll: false,
      loading: false,
      complete: false,
      pageNo: 1,
      edit: false,
      visible: false,
    }
  },
  components: {
    Modal,
  },
  mounted() {
    this.$store.dispatch('getUserInfo')
  },
  computed: {
    total() {
      const total = this.productList.filter(v => v.checked).reduce((prev, cur) => prev + parseFloat(cur.price) * parseInt(cur.amount), 0)

      return total.toFixed(2) || ''
    },
    checkedNum() {
      return this.productList.filter(v => v.checked).length
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    decreaseDisabled() {
      return product => product.amount <= product.minOrderQuantity
    },
  },

  onShow() {
    this.checkAll = false
    this.getProduct()
  },
  methods: {
    handleEdit() {
      this.edit = !this.edit
      if (this.edit) {
        // 编辑
      } else {
        const params = {
          json: JSON.stringify(
            this.productList.map(v => ({
              amount: v.amount,
              shopCarId: v.oid,
            }))
          ),
        }
        this.$API
          .editShopCar(params)
          .then(() => {
            console.log('updateProduct')
          })
          .catch(res => {
            Taro.showToast({
              title: res.msg,
              icon: 'none',
            })
          })
        // 保存
      }
    },
    getProduct(type) {
      this.loading = true
      this.$API
        .getShopcarList({
          limit: 10,
          pageNo: this.pageNo,
        })
        .then(data => {
          data = data || []
          if (type === 'loadMore') {
            this.productList = this.productList.concat(data)
          } else {
            this.productList = data
          }
          this.productList = this.productList.map(v => ({
            ...v,
            checked: false,
          }))
          if (data.length === 0) {
            this.complete = true
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    go() {
      Taro.switchTab({ url: '/pages/product/index' })
    },
    addProduct(product) {
      product.amount = parseInt(product.amount) + parseInt(product.productUnitConvertRule)
      this.updateProduct(product)
    },
    deleteProduct(product, index) {
      this.visible = true
      this.deleteOid = product.oid
    },
    decreaseProduct(product, index) {
      if (this.decreaseDisabled(product)) return
      product.amount -= parseInt(product.productUnitConvertRule)
      if (product.amount <= 1) {
        this.productList.splice(index, 1)
        return
      }

      this.updateProduct(product)
    },
    change(product, index) {
      this.productList[index].checked = !product.checked
      this.checkAll = this.productList.every(v => v.checked)
    },
    handleCheckAll() {
      this.checkAll = !this.checkAll
      this.productList.forEach(v => (v.checked = this.checkAll))
    },
    handleSettle() {
      const someProductChecked = this.productList.some(v => v.checked)
      if (someProductChecked) {
        const shopIds = this.productList
          .filter(v => v.checked)
          .map(v => v.oid)
          .join(',')

        Taro.navigateTo({
          url: `/pages/confirm-order/index?shopIds=${shopIds}`,
        })
        // this.$API
        //   .paySettlement({
        //     shopIds,
        //   })
        //   .then(data => {
        //     // Taro.navigateTo({ url: '/pages/confirm-order/index' })
        //   })
      }
    },
    handleDelete() {
      if (!this.productList.some(v => v.checked)) {
        return
      }
      this.visible = true
      const someProductChecked = this.productList.filter(v => v.checked)
      this.deleteOid = someProductChecked.map(v => v.oid).join(',')
    },
    confirmDelete() {
      this.$API
        .delByOid({
          oid: this.deleteOid,
        })
        .then(() => {
          this.getProduct()
          // this.productList = this.productList.filter(v => this.deleteOid.indexOf(v.oid) === -1)
          Taro.showToast({ title: '删除成功', icon: 'success' })
          this.visible = false
        })
        .catch(res => {
          Taro.showToast({ title: res.msg || '', icon: 'none' })
          this.visible = false
        })
    },
    toLower() {
      if (this.loading || this.complete) {
        return
      }
      this.pageNo++
      this.getProduct('loadMore')
    },
    onClick(product) {
      Taro.navigateTo({ url: `/pages/product-detail/index?id=${product.productId}` })
    },
    onBlur(product) {
      if (!product.amount || this.edit) return
      product.amount = parseInt(product.amount)
      this.updateProduct(product)
    },
    updateProduct(product) {
      const params = {
        json: JSON.stringify([
          {
            amount: product.amount,
            shopCarId: product.oid,
          },
        ]),
      }
      this.$API
        .editShopCar(params)
        .then(() => {
          console.log('updateProduct')
        })
        .catch(res => {
          Taro.showToast({
            title: res.msg,
            icon: 'none',
          })
        })
    },
  },
}
</script>
