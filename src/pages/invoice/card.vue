<template>
  <view class="flex">
    <view class="invoice-status-icon">
      <image :src="statusIconMap" mode="widthFix" />
    </view>
    <checkbox :checked="bill.checked" @tap.stop="() => $emit('handleCheck', bill)" v-if="bill.canApply"></checkbox>
    <view v-else class="disable-apply"></view>
    <view style="flex: 1"
      ><view class="invoice-list-row">
        <view class="invoice-list-date">
          <text class="invoice-list-icon"></text>
          {{ bill.time }}
          {{ bill.week }}
        </view>
        <view class="invoice-list-sum" v-show="!isMonthUser">{{ bill.amount }}元</view>
      </view>
      <view class="invoice-list-row">
        <view>
          <text class="invoice-list-icon active"></text>
          味全产品 共
          {{ bill.num }}
          单
        </view>
        <view class="invoice-list-action" @tap="() => $emit('handleMore', bill)"
          >更多
          <image :src="arrowIcon" class="arrow" :class="bill.expand ? 'arrow-up' : 'arrow-down'" mode="" />
        </view> </view
    ></view>
  </view>
</template>

<script>
import arrowIcon from '@/images/arrow-down.png'
import open_ok from './images/open-ok.png'
import return_open_ok from './images/return-open-ok.png'
import open_invoice_error from './images/open-invoice-error.png'
import open_invoice_success from './images/open-invoice-success.png'

// invoiceFlg 01电子普票  02增票 03普票 04电子增票
// isApply 0未开票 1已申请 2开票失败 3已开票
export default {
  props: {
    bill: Object,
    isMonthUser: Boolean,
    type: String,
  },
  data() {
    return {
      arrowIcon,
      status: {
        0: '未开票',
      },
      open_ok,
      return_open_ok,
      open_invoice_error,
      open_invoice_success,
    }
  },
  computed: {
    statusIconMap() {
      const iconMap = {
        return: {
          1: return_open_ok,
          2: return_open_ok,
          3: open_invoice_success,
        },
        delivery: {
          1: open_ok,
          2: open_ok,
          3: open_invoice_success,
        },
      }
      return iconMap[this.type][this.bill.isApply]
    },
  },
  methods: {
    handleCheck() {
      this.$emit('handleCheck')
    },
  },
}
</script>
