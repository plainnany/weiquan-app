<template>
  <view class="change-account">
    <view class="user-list" v-for="(user, index) in accountList" :key="index" @tap="changeUser">
      <view class="user-avatar">
        <image :src="user.avatar" mode="" />
      </view>
      <view class="user-info">
        <view>{{ user.name }}</view>
        <view>ID: {{ user.id }}</view>
      </view>
      <view class="user-current" v-if="isCurrentUser">
        <image :src="checkIcon" mode="" />
      </view>
    </view>
    <view class="add-user user-list" @tap="addUser">
      <view class="user-avatar">
        <image :src="addIcon" mode="" />
      </view>
      <view>添加账号</view>
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
      accountList: [
        {
          avatar: '',
          name: '测试名称',
          id: '用户Id',
        },
        {
          avatar: '',
          name: '测试名称',
          id: '用户Id',
        },
      ],
    }
  },
  computed: {
    isCurrentUser() {
      return false
    },
  },
  mounted() {
    setTitle({ title: '切换账号' })
  },
  methods: {
    changeUser() {},
    addUser() {
      console.log('添加用户')
    },
  },
}
</script>
