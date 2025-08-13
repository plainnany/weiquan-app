<template>
  <view class="charge-record">
    <view class="charge-tabs">
      <view class="charge-tab" :class="{ active: active === tab.key }" @tap="clickTab(tab)" v-for="tab in tabs" :key="tab.key">
        {{ tab.name }}</view
      >
      <view class="divider"></view>
    </view>
    <scroll-view :scroll-y="true" @scrolltolower="toLower" v-if="chargeList.length">
      <view class="charge-list">
        <view class="charge-list-item" v-for="(item, index) in chargeList" :key="index" @tap="viewOrderDetail(item)">
          <view class="charge-list-item-title">
            <text>{{ chargeTitle(item) }}</text>
            <text class="charge-list-item-date">{{ item.billDate }}</text>
          </view>
          <view class="charge-list-item-content">
            <view>
              <view class="charge-list-item-remain">{{ item.activityFlg === '01' ? '活动金额' : '余额' }}: {{ item.accountBalance }}</view>
            </view>
            <view class="charge-list-item-number"
              ><text>{{ active === 'charge' ? '+' : '-' }}</text
              ><text>{{ item.payAmount }}</text></view
            >
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="empty" v-else>暂无数据</view>
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'
import Taro from '@tarojs/taro'

export default {
  name: 'cost',
  components: {},
  data() {
    return {
      active: 'charge',
      balance: '',
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
      chargeList: [],
      loading: false,
      complete: false,
      pageNo: 1,
    }
  },
  mounted() {
    setTitle({ title: '余额明细' })
    this.getBillCost()
    this.getChargeList()
  },
  methods: {
    chargeTitle(item) {
      if (this.active === 'charge') {
        if (item.state === '04') {
          return '返还'
        }
        return '充值'
      }
      return '消费'
    },
    clickTab({ key }) {
      this.active = key
      this.complete = false
      this.pageNo = 1
      this.getChargeList()
    },
    getBillCost() {
      this.$API.getBillCost().then(data => {
        this.balance = data
      })
    },
    handleCharge() {
      Taro.navigateTo({ url: '/pages/charge/index' })
    },
    getChargeList(type) {
      const method = this.active === 'charge' ? 'rechargeRecord' : 'consumptionRecord'
      this.$API[method]({
        pageNo: this.pageNo,
        limit: 10,
      }).then(data => {
        data = data || []
        if (type === 'loadMore') {
          this.chargeList = this.chargeList.concat(data)
        } else {
          this.chargeList = data
        }

        if (data.length === 0) {
          this.complete = true
        }
      })
    },

    toLower() {
      if (this.loading || this.complete) {
        return
      }
      this.pageNo++
      this.getChargeList('loadMore')
    },
    viewOrderDetail(item) {
      if (this.active === 'consume') {
        Taro.navigateTo({
          url: `/pages/order-detail/index?order=${item.orderNumber}&type=all`,
        })
      }
    },
  },
}
</script>
