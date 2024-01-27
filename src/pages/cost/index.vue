<template>
  <view class="remain-page">
    <view class="remain-info">
      <view class="remain-title">
        账户余额(元)
      </view>

      <view class="remain-money">
        <view class="remain-num">
          <text>{{ balance }}</text>
        </view>
      </view>
    </view>
    <view class="remain-item" @tap="handleCharge" v-if="userInfo.accountType !== '02'">
      <image :src="icon2" class="icon" mode="" />
      <view>
        充值
      </view>
      <view class="remain-item-arrow">
        <image :src="backImg" mode="" />
      </view>
    </view>
    <view class="remain-item" @tap="handleDetail">
      <image :src="icon1" class="icon" mode="" />
      <view>
        查看明细
      </view>
      <view class="remain-item-arrow">
        <image :src="backImg" mode="" />
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'
import Taro from '@tarojs/taro'
import icon1 from '@/images/account_acc.png'
import icon2 from '@/images/account_up.png'
import backImg from '@/images/user/back.png'

export default {
  name: 'cost',
  components: {},
  data() {
    return {
      icon1,
      icon2,
      backImg,
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
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  mounted() {
    this.getBillCost()
    this.getChargeList()
  },
  methods: {
    clickTab({ key }) {
      this.active = key
      this.complete = false
      this.pageNo = 1
      this.getChargeList()
    },
    getBillCost() {
      this.$API.getBillCost().then(data => {
        this.balance = Number(data).toFixed(2)
      })
    },
    handleCharge() {
      Taro.navigateTo({ url: '/pages/charge/index' })
    },
    handleDetail() {
      Taro.navigateTo({ url: '/pages/cost/detail' })
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
    handleNav(item) {
      Taro.navigateTo({ url: `${item.path}` })
    },
  },
}
</script>
