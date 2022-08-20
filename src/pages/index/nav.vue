<template>
  <view class="nav">
    <view class="nav-item" v-for="item in navList" :key="item.path">
      <image :src="item.img" mode="" />
    </view>
  </view>
</template>

<script>
import chargeImg from '@/images/charge.png'
import messageImg from '@/images/message.png'
import orderImg from '@/images/order.png'
import signImg from '@/images/sign.png'

export default {
  data() {
    return {
      navList: [
        {
          img: chargeImg,
          title: '充值',
          path: 'a',
        },
        {
          img: signImg,
          title: '签收',
          path: 'b',
        },
        {
          img: orderImg,
          title: '下单',
          path: 'c',
        },
        {
          img: messageImg,
          title: '消息',
          path: 'd',
        },
      ],
    }
  },
}
</script>

<style lang="less">
.nav {
  position: relative;
  width: calc(100% - 68px);
  margin: 0 auto;
  background: #fff;
  padding: 32px 24px 0 8px;
  margin-top: -80px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 13px 26px 0 rgba(187, 175, 175, 0.14);
  border-radius: 31px;
  box-sizing: border-box;

  &-item {
    text-align: center;
    font-size: 32px;

    image {
      width: 140px;
      height: 140px;
    }
  }
}
</style>
