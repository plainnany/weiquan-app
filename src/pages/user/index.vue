<template>
  <view class="user-page">
    <view class="user-info">
      <view class="user-info-wrapper">
        <view class="user-avatar">
          <image :src="avatarImg" mode="" />
        </view>
        <view>
          <view class="user-name">
            <text>{{ username }}</text>
            <text class="change-user">切换账号</text>
          </view>
          <view class="user-mobile">
            <text>{{ mobile }} | </text>
            <text>现金用户</text>
          </view>
        </view>
      </view>
      <view class="user-empty">
        <text>
          为确保账号安全，请绑定账号
        </text>
        <text class="user-bind-account">立即绑定</text>
      </view>
    </view>
    <view class="user-card user-charge">
      <view v-for="(tab, index) in tabs" :key="index">
        <image :src="tab.icon" mode="" />
        <view>
          {{ tab.title }}
        </view>
      </view>
    </view>
    <view class="user-order">
      <text>
        我的订单
      </text>
      <view class="user-order-link"
        >所有订单
        <image :src="backImg" mode="" />
      </view>
    </view>
    <view class="order-all user-card">
      <view v-for="(order, index) in orderList" :key="index">
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
      <view class="action-item" v-for="(item, index) in items" :key="index">
        <image :src="item.icon" mode="" />
        <view class="action-item-text">{{ item.title }}</view>
        <view class="action-item-link">
          <image :src="backImg" mode="" />
        </view>
      </view>
    </view>
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
import orderImg from '@/images/user/order.png'
import payImg from '@/images/user/pay.png'
import settingImg from '@/images/user/setting.png'
import './index.less'

export default {
  name: 'user',
  components: {},
  data() {
    return {
      msg: '',
      linkIcon: '',
      userInfo: {
        name: '',
        mobile: '',
      },
      backImg,
      avatarImg: '',
      username: '测试用户名称',
      mobile: '123****5678',
      tabs: [
        { icon: chargeImg, title: '余额及充值' },
        { icon: eletronicBillImg, title: '电子对账单' },
        { icon: ruleImg, title: '配送规则' },
      ],
      orderList: [
        { icon: payImg, title: '待付款' },
        { icon: deleverImg, title: '查询修改' },
        { icon: toReceiveImg, title: '待收货' },
        { icon: commentsImg, title: '已完成' },
        { icon: customServiceImg, title: '我的订单' },
      ],
      items: [
        {
          icon: orderImg,
          title: '下单提醒',
          path: 'a',
        },
        {
          icon: complainImg,
          title: '查看客诉',
          path: 'b',
        },
        {
          icon: checkImg,
          title: '检查报告单',
          path: 'b',
        },
        {
          icon: manualImg,
          title: '操作手册',
          path: 'b',
        },

        {
          icon: messageImg,
          title: '消息中心',
          path: 'b',
        },
        {
          icon: settingImg,
          title: '设置',
          path: 'b',
        },
        {
          icon: helpImg,
          title: '帮助中心',
          path: 'b',
        },
      ],
    }
  },
  methods: {},
}
</script>
