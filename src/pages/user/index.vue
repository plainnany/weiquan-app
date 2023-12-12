<template>
  <view class="user-page">
    <view class="user-info">
      <view class="user-info-wrapper" @tap="handleNav({ path: '/pages/account-manage/index' })">
        <view class="setting">
          <image :src="settingImg" mode="" @tap="handleNav({ path: '/pages/setting/index' })" />
          <image :src="noticeImg" class="notice" mode="" @tap="handleNav({ path: '/pages/notice/index' })" />
        </view>
        <view class="user-avatar">
          <image :src="userInfo.headPic" mode="" />
        </view>
        <view>
          <view class="user-name">
            <text>{{ userInfo.customerName || '默认名称' }}</text>
            <!-- <text class="change-user" @tap="handleNav({ path: '/pages/change-account/index' })" v-if="userInfo.userId">切换账号</text> -->
          </view>
          <view class="user-mobile">
            <view> ID: {{ userInfo.userId || '未绑定账号' }} </view>
            <view class="user-empty" v-if="!userInfo.userId && hasGetUserInfo">
              <text class="user-bind-account" @tap.stop="() => (visible = true)">立即绑定</text>
            </view>
            <view>
              <image :src="userImg" mode="" class="user-icon" />
              {{ accountTypeMap[userInfo.accountType] }}</view
            >
          </view>
          <view class="user-detail">
            <image :src="arrowRightImg" class="back" mode="" />
          </view>
        </view>
      </view>
    </view>
    <view class="order-all user-card">
      <view v-for="(order, index) in orderList" :key="index" @tap="handleNav(order)">
        <view class="order-icon">
          <image :src="order.icon" mode="" />
        </view>
        <view>
          {{ order.title }}
        </view>
      </view>
    </view>
    <view class="user-action user-card">
      <view class="action-item" v-for="(item, index) in items1" :key="index" @tap="handleNav(item)">
        <image :src="item.icon" mode="" />
        <view class="action-item-text">{{ item.title }}</view>
        <view class="action-item-link">
          <image :src="backImg" mode="" />
        </view>
      </view>
    </view>
    <view class="user-action user-card">
      <view class="action-item" v-for="(item, index) in items2" :key="index" @tap="handleNav(item)">
        <image :src="item.icon" mode="" />
        <view class="action-item-text">{{ item.title }}</view>
        <view class="action-item-link">
          <image :src="backImg" mode="" />
        </view>
      </view>
    </view>

    <nan-modal v-if="visible" :visible="visible" title="绑定账号" confirmText="确认" @cancel="onCancel" @confirm="onConfirm">
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
// import messageImg from '@/images/user/message.png'
import payImg from '@/images/user/pay.png'
import settingImg from '@/images/user/setting.svg'
import './index.less'
import Taro from '@tarojs/taro'
import { AES } from 'crypto-js'
import { BASE_URL } from '@/const'
import arrowRightImg from '@/images/user/arrow-right.png'
import noticeImg from '@/images/user/notice.svg'
import notice2Img from '@/images/user/notice.png'
import userImg from '@/images/center-user.png'

export default {
  name: 'user',
  components: {},
  data() {
    return {
      backImg,
      // tabs: [
      //   { icon: chargeImg, title: '余额及充值', path: '/pages/cost/index' },
      //   { icon: eletronicBillImg, title: '电子对账单', path: '/pages/electronic-bill/index' },
      //   { icon: ruleImg, title: '配送规则', path: `/pages/web-view/index?url=${BASE_URL}/product-rule.htm` }, // 配送规则可能是个h5地址，先暂时放着
      // ],
      orderList: [
        { icon: payImg, title: '待付款', path: '/pages/order/index?type=to-pay' },
        { icon: deleverImg, title: '查询&修改', path: '/pages/order/index' },
        { icon: toReceiveImg, title: '当天收货', path: '/pages/order/index?type=to-delivery' },
        { icon: commentsImg, title: '已完成', path: '/pages/order/index?type=done' },
        { icon: customServiceImg, title: '我的订单', path: '/pages/order/index' },
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
      hasGetUserInfo: true,
      // 01：现金客户;02：月结客户;03：预付款客户04：货到付款
      accountTypeMap: {
        '01': '现金客户',
        '02': '月结客户',
        '03': '预付款客户',
        '04': '货到付款',
      },
      arrowRightImg,
      settingImg,
      noticeImg,
      userImg,
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    items1() {
      return [
        { icon: chargeImg, title: '账户余额', path: '/pages/cost/index' },
        { icon: eletronicBillImg, title: '电子对账单', path: '/pages/electronic-bill/index' },
        // { icon: ruleImg, title: '开票申请', path: `/pages/web-view/index?url=${BASE_URL}/product-rule.htm` }, // 配送规则可能是个h5地址，先暂时放着
        { icon: ruleImg, title: '配送规则', path: `/pages/web-view/index?url=${BASE_URL}/product-rule.htm` }, // 配送规则可能是个h5地址，先暂时放着
      ]
    },
    items2() {
      return [
        {
          icon: notice2Img,
          title: '下单提醒',
          path: '/pages/order-notice/index',
        },
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
          title: '操作手册/公告',
          isNotice: true,
        },
        // {
        //   icon: messageImg,
        //   title: '消息中心',
        //   path: `/pages/notice/index`,
        // },

        {
          icon: helpImg,
          title: '帮助中心',
          isWebview: true,
          path: `/pages/web-view/index?url=${BASE_URL}/service.htm`,
          // path: `/pages/web-view/index?url=${this.$store.state.userInfo.helpLink}`,
        },
        // {
        //   icon: settingImg,
        //   title: '设置',
        //   path: '/pages/setting/index',
        // },
      ]
    },
  },
  mounted() {
    try {
      const unionId = Taro.getStorageSync('unionId')
      this.unionId = unionId
    } catch (e) {}
  },
  onShow() {
    const sesstionToken = Taro.getStorageSync('token')
    if (this.userInfo.userId && sesstionToken === this.userInfo.token) return
    this.$store.dispatch('getUserInfo').finally(() => {
      this.hasGetUserInfo = true
    })
  },
  onHide() {
    this.visible = false
  },
  methods: {
    onCancel() {
      this.visible = false
    },
    onConfirm() {
      if (!this.customerCode || !this.customerPassword || !this.checkedAccountType) {
        return Taro.showToast({
          title: '请将内容填写完整',
          icon: 'none',
        })
      }
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
            this.$store.commit('setUserInfo', data)
            Taro.setStorageSync('token', data.token)
            this.visible = false
          }
        })
        .catch(err => {
          Taro.showToast({
            title: err.msg,
            icon: 'none',
          })
        })
    },
    handleNav(item) {
      if (!this.$store.state.userInfo.userId && item.isWebview) {
        Taro.showToast({
          title: '用户未登录，请先绑定用户',
          icon: 'none',
          success() {
            setTimeout(() => {
              Taro.navigateTo({ url: '/pages/bind-account/index' })
            }, 2000)
          },
        })
      } else {
        if (item.isNotice) {
          return this.getNotice(item)
        }
        if (item.path.includes('product-rule')) {
          Taro.navigateTo({ url: `${item.path}&token=${this.userInfo.token}` })
          return
        }
        Taro.navigateTo({ url: item.path })
      }
    },
    accountTypeChange(e) {
      this.checkedAccountType = this.accountTypes[e.detail.value].label
      this.userType = this.accountTypes[e.detail.value].userType
    },
    getNotice(item) {
      this.$API.messageCenter().then(res => {
        const data = res.Post
        Taro.navigateTo({
          url: `/pages/notice/detail?title=${item.title}&key=Post&post=${data.postTitle}&date=${data.createTime}&postUrl=${data.postUrl}`,
        })
      })
    },
  },
}
</script>
