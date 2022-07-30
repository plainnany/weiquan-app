<template>
  <view class="nav">
    <view class="nav-item" v-for="item in navList" :key="item.path">{{ item.title }}</view>
    <!-- <text>这是一个导航栏</text> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        {
          title: '充值',
          path: 'a',
        },
        {
          title: '签收',
          path: 'b',
        },
        {
          title: '下单',
          path: 'c',
        },
        {
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
  width: 80%;
  margin: 0 auto;
  background: #fff;
  padding: 24px 48px;
  border-radius: 24px;
  margin-top: -50px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 2px 24px 0px rgba(200, 201, 204, 0.5);

  &-item {
    width: 100px;
    height: 76px;
    background: greenyellow;
    border-radius: 25px;
    padding: 12px 0;
    text-align: center;
    font-size: 32px;
  }
}
</style>
