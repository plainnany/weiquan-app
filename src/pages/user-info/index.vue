<template>
  <view class="user-info">
    <view class="user-info-wrapper">
      <view class="user-info-list">
        <view class="user-info-left">头像</view>
        <view class="user-info-right">
          <image :src="userInfo.avatar" mode="" />
        </view>
      </view>
      <view class="user-info-list" v-for="(value, key) in mapKeys" :key="key">
        <view class="user-info-left"> {{ value }}</view>
        <view class="user-info-right">
          {{ userInfo[key] }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'
import { setTitle } from '@/utils'
import checkIcon from '@/images/check.png'
import addIcon from '@/images/add.png'

export default {
  components: {},
  data() {
    return {
      checkIcon,
      addIcon,
      mapKeys: {
        name: '昵称',
        id: 'ID',
        address: '地址',
        consignee: '收货人',
        consigneeNumber: '收货人电话',
        contactNumber: '联系人电话',
      },
      userInfo: {
        avatar: '',
        name: '楠楠楠',
        id: '12333',
        address: '杭州市',
        consignee: '李女士',
        consigneeNumber: '1234567890',
        contactNumber: '1234567890',
      },
    }
  },
  computed: {},
  mounted() {
    setTitle({ title: '用户信息' })
  },
  methods: {},
}
</script>
