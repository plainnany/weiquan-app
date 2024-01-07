<template>
  <view>
    <view class="invoice-list-extra" v-for="(item, index) in list" :key="index">
      <view class="invoice-list-row">
        <view>
          {{ item.productName }}
        </view>
        <view class="invoice-list-sum">{{ item.price }}</view>
      </view>
      <view> <text class="normal"> 规格:</text> {{ item.productUnit }}</view>
      <view> <text class="normal"> 单价:</text> {{ !isMonthUser ? item.productPrice : '' }}</view>
      <view> <text class="normal">发货数量:</text>{{ item.num }}</view>
      <view>
        <text class="normal">
          订单类型:
        </text>
        <text class="return-type">{{ typeMap[type] }}</text></view
      >
      <view v-if="item.deliveryCode">
        <text v-if="type === 'delivery'">
          <text class="normal">发货单:</text>
          <text class="code">{{ item.deliveryCode }} </text>
        </text>
        <text v-if="isReturn">
          <text class="yellow">原始发货单号:</text>
          <text class="code">{{ item.deliveryCode }} </text>
        </text>
      </view>
      <view v-if="isReturn"> <text class="normal">原始发货日:</text>{{ item.deliveryDate }}</view>
      <view v-if="isApply(item)">
        <text class="normal">开票状态:</text>
        <text class="status" :class="{ fail: item.type === '2' }">{{ status[item.type] }}</text>
      </view>
      <view v-if="isApply(item) && item.type === '2'">
        <text class="normal">失败原因</text>
        <text>{{ item.reason }}</text>
      </view>
      <view class="price" v-if="!isMonthUser">{{ total(item) }}</view>
    </view>
  </view>
</template>

<script>
// invoiceFlg 01电子普票  02增票 03普票 04电子增票
export default {
  props: {
    list: Array,
    isMonthUser: Boolean,
    type: String,
  },
  data() {
    return {
      // 开票状态
      status: {
        1: '开票成功',
        2: '开票失败',
      },
    }
  },
  computed: {
    isApply() {
      return item => item.type !== '0'
    },
    total() {
      return item => Number(item.num * item.productPrice).toFixed(2)
    },
    typeMap() {
      return {
        return: '退货单',
        delivery: '发货单',
      }
    },

    isReturn() {
      return this.type === 'return'
    },
  },
}
</script>
