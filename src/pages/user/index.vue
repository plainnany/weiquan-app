<template>
  <view class="user-page">
    <view class="user-info">
      <view class="user-info-wrapper">
        <view class="user-avatar">
          <image :src="userInfo.headPic" mode="" />
        </view>
        <view>
          <view class="user-name">
            <text>{{ userInfo.customerName || '默认名称' }}</text>
            <text class="change-user" @tap="handleNav({ path: '/pages/change-account/index' })" v-if="userInfo.userId">切换账号</text>
          </view>
          <view class="user-mobile">
            <text>{{ userInfo.consigneeLink || '未绑定账号' }} | </text>
            <text>现金用户</text>
          </view>
        </view>
      </view>
      <view class="user-empty" v-if="!userInfo.userId && hasGetUserInfo">
        <text>
          为确保账号安全，请绑定账号
        </text>
        <text class="user-bind-account" @tap="() => (visible = true)">立即绑定</text>
      </view>
    </view>
    <view class="user-card user-charge">
      <view v-for="(tab, index) in tabs" :key="index" @tap="handleNav(tab)">
        <image :src="tab.icon" mode="" />
        <view>
          {{ tab.title }}
        </view>
      </view>
    </view>
    <view class="user-order" @tap="handleNav({ path: '/pages/order/index' })">
      <text>
        我的订单
      </text>
      <view class="user-order-link"
        >所有订单
        <image :src="backImg" mode="" />
      </view>
    </view>
    <view class="order-all user-card">
      <view v-for="(order, index) in orderList" :key="index" @tap="handleNav(order)">
        <view class="order-icon">
          <image :src="order.icon" mode="" />
          <!-- <text class="order-num">5</text> -->
        </view>
        <view>
          {{ order.title }}
        </view>
      </view>
    </view>
    <view class="user-action user-card">
      <view class="action-item" v-for="(item, index) in items" :key="index" @tap="handleNav(item)">
        <image :src="item.icon" mode="" />
        <view class="action-item-text">{{ item.title }}</view>
        <view class="action-item-link">
          <image :src="backImg" mode="" />
        </view>
      </view>
    </view>

    <nan-modal :visible="visible" title="绑定账号" confirmText="确认" @cancel="onCancel" @confirm="onConfirm">
      <view class="form-item">选择身份</view>
      <view class="form-item-wrapper">
        <picker mode="selector" :range="accountTypes" @change="accountTypeChange" range-key="label">
          <text v-if="checkedAccountType">{{ checkedAccountType }}</text>
          <text v-else>请选择身份</text>
        </picker>
      </view>
      <view class="form-item">账户密码</view>
      <input v-model="customerCode" placeholder-style="color:#a89e9e" placeholder="请输入账户" />
      <input v-model="customerPassword" type="password" placeholder-style="color:#a89e9e" placeholder="请输入密码" />
    </nan-modal>
  </view>
</template>

<script>
import ruleImg from '@/images/user/rule.png'
import chargeImg from '@/images/user/charge.png'
import eletronicBillImg from '@/images/user/eletronic-bill.png'
import toReceiveImg from '@/images/user/to-receive.png'
import backImg from '@/images/user/back.png'
import checkImg from '@/images/user/check.png'
import commentsImg from '@/images/user/comments.png'
import complainImg from '@/images/user/complain.png'
import customServiceImg from '@/images/user/custom-service.png'
import deleverImg from '@/images/user/delever.png'
import helpImg from '@/images/user/help.png'
import manualImg from '@/images/user/manual.png'
import messageImg from '@/images/user/message.png'
import payImg from '@/images/user/pay.png'
import settingImg from '@/images/user/setting.png'
import './index.less'
import Taro from '@tarojs/taro'
import { AES } from 'crypto-js'

export default {
  name: 'user',
  components: {},
  data() {
    return {
      msg: '',
      linkIcon: '',
      backImg,
      avatarImg: '',
      username: '测试用户名称',
      mobile: '123****5678',
      tabs: [
        { icon: chargeImg, title: '余额及充值', path: '/pages/cost/index' },
        { icon: eletronicBillImg, title: '电子对账单', path: '/pages/electronic-bill/index' },
        { icon: ruleImg, title: '配送规则', path: '/pages/deliver-rule/index' },
      ],
      orderList: [
        { icon: payImg, title: '待付款', path: '/pages/order/index?type=to-pay' },
        { icon: deleverImg, title: '查询修改', path: '/pages/order/index' },
        { icon: toReceiveImg, title: '待收货', path: '/pages/order/index?type=to-receive' },
        { icon: commentsImg, title: '已完成', path: '/pages/order/index?type=done' },
        { icon: customServiceImg, title: '我的订单', path: '/pages/order/index' },
      ],
      items: [
        // {
        //   icon: orderImg,
        //   title: '下单提醒',
        //   path: 'a',
        // },
        {
          icon: complainImg,
          title: '查看客诉',
          path: '/pages/custom-comment/index',
        },
        {
          icon: checkImg,
          title: '检验报告单',
          path: '/pages/quality-report/index',
        },
        {
          icon: manualImg,
          title: '操作手册',
        },
        {
          icon: messageImg,
          title: '消息中心',
          path: '/pages/web-view/index?type=news',
        },
        {
          icon: settingImg,
          title: '设置',
          path: '/pages/setting/index',
        },
        {
          icon: helpImg,
          title: '帮助中心',
          path: '/pages/web-view/index?type=help',
        },
      ],
      visible: false,
      customerCode: '',
      customerPassword: '',
      userType: '',
      accountTypes: [
        {
          label: '店长',
          userType: '1',
        },
        {
          label: '店员',
          userType: '2',
        },
      ],
      checkedAccountType: '',
      unionId: '',
      hasGetUserInfo: false,
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  mounted() {
    this.$store.dispatch('getUserInfo').finally(() => {
      this.hasGetUserInfo = true
    })

    try {
      const unionId = Taro.getStorageSync('unionId')
      this.unionId = unionId
    } catch (e) {}
  },
  methods: {
    onCancel() {
      this.visible = false
    },
    onConfirm() {
      const password = AES.encrypt(this.customerPassword, '30886A121CEDEFDE3ED765311F89964C').toString()

      this.$API
        .bindShop({
          unionId: this.unionId,
          customerCode: this.customerCode,
          password,
          userType: this.userType,
        })
        .then(data => {
          if (data) {
            console.log(data)
          }
        })
    },
    handleNav(item) {
      Taro.navigateTo({ url: item.path })
    },
    accountTypeChange(e) {
      this.checkedAccountType = this.accountTypes[e.detail.value].label
      this.userType = this.accountTypes[e.detail.value].userType
    },
  },
}
</script>
