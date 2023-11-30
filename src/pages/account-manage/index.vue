<template>
  <view class="account-manage">
    <view class="account-manage-card" v-for="(group, index) in items" :key="index">
      <view class="account-manage-item" v-for="item in group" :key="item.key" @tap="handleChange(item)">
        <view>{{ item.name }}</view>
        <view v-if="item.key === 'headPic'">
          <image :src="userInfo.headPic" mode="" />
        </view>
        <view v-else class="right">
          {{ userInfo[item.key] }}
          <image :src="item.icon" mode="" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './index.less'
import { setTitle } from '@/utils'
import backImg from '@/images/user/back.png'

export default {
  components: {},
  data() {
    return {
      items: [
        [
          {
            name: '头像',
            key: 'headPic',
            needChange: true,
          },
        ],
        [
          {
            name: '昵称',
            key: 'customerName',
          },
          {
            name: '地址',
            key: 'customerAddress',
          },
        ],
        [
          {
            name: '收货人',
            key: 'customerLinkMan',
            needChange: true,
            icon: backImg,
          },
          {
            name: '收货人电话',
            key: 'consigneeLink',
            needChange: true,
            icon: backImg,
          },
          {
            name: '联系人电话',
            key: 'customerLinkTel',
            needChange: true,
            icon: backImg,
          },
        ],
      ],
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  mounted() {
    setTitle({ title: '账户管理' })
  },
  methods: {
    handleChange(item) {
      if (item.needChange) {
        Taro.navigateTo({ url: `/pages/account-modify/index?key=${item.key}&title=${item.name}` })
      }
    },
  },
}
</script>
