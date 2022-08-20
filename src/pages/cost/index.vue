<template>
  <view class="remain-page">
    <view class="remain-info">
      <text>
        可用余额(元)
      </text>
      <view class="remain-money">
        <view class="remain-num">
          <text>¥</text>
          <text>12333</text>
        </view>
        <text class="remain-charge">充值</text>
      </view>
    </view>
    <view class="charge-record">
      <view class="charge-tabs">
        <view class="charge-tab" :class="{ active: active === tab.key }" @tap="clickTab(tab)" v-for="tab in tabs" :key="tab.key">
          {{ tab.name }}</view
        >
      </view>
      <view class="charge-list">
        <view class="charge-list-item" v-for="(item, index) in list" :key="index">
          <view class="charge-list-item-title">
            <text>现金充值</text>
            <text class="charge-list-item-date">{{ item.date }}</text>
          </view>
          <view class="charge-list-item-content">
            <view>
              <view class="charge-list-item-remain">余额 {{ item.remain }}</view>
              <view class="charge-list-item-order">改单退款 {{ item.orderNo }}</view>
            </view>
            <view class="charge-list-item-number">{{ item.number }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'

export default {
  name: 'cost',
  components: {},
  data() {
    return {
      active: 'charge',
      tabs: [
        {
          name: '充值记录',
          key: 'charge',
        },
        {
          name: '消费记录',
          key: 'consume',
        },
      ],
      list: [
        {
          type: '现金充值',
          remain: '100',
          orderNo: '订单编号',
          date: '2022-8-20',
          number: '+12',
        },
        {
          type: '现金充值',
          remain: '100',
          orderNo: '订单编号',
          date: '2022-8-20',
          number: '+12',
        },
      ],
    }
  },
  methods: {
    clickTab({ key }) {
      this.active = key
    },
  },
}
</script>
