<template>
  <view class="setting-page">
    <view class="setting-card" v-for="(item, index) in list" :key="index" @tap="handleNav(item)">
      <view style="display:flex; align-items: center">
        <image :src="item.icon" mode="" />
        <text>{{ item.text }}</text>
      </view>
      <view v-if="item.showBack">
        <image :src="backIcon" class="back-icon" mode="" />
      </view>
      <view v-if="item.showInfo">
        {{ item.info }}
      </view>
    </view>
    <view class="setting-btn">
      <nan-button type="primary" @tap="quit">退出当前账号</nan-button>
    </view>
  </view>
</template>

<script>
import './index.less'
import backIcon from '@/images/user/back.png'
import fileIcon from '@/images/setting/file.png'
import lockIcon from '@/images/setting/lock.png'
import noticeIcon from '@/images/setting/notice.png'
import warningIcon from '@/images/setting/warning.png'
import questionIcon from '@/images/setting/question.png'
import { setTitle } from '@/utils'
import Taro from '@tarojs/taro'

export default {
  components: {},
  data() {
    return {
      backIcon,
      list: [
        {
          text: '问题反馈',
          icon: warningIcon,
          showBack: true,
          path: '/pages/custom-comment/index',
        },
        {
          text: '修改门店收货码',
          icon: lockIcon,
          showBack: true,
          path: '/pages/change-receive-code/index',
        },
        {
          text: '修改登录密码',
          icon: fileIcon,
          showBack: true,
          path: '',
        },
        // {
        //   text: '清除缓存',
        //   icon: noticeIcon,
        //   showInfo: true,
        //   info: '23M',
        // },
        {
          text: '当前版本',
          icon: questionIcon,
          showInfo: true,
          info: '1.1.0',
        },
      ],
    }
  },
  computed: {},
  mounted() {
    setTitle({ title: '设置' })
  },
  methods: {
    quit() {
      console.log('退出')
    },
    handleNav(item) {
      Taro.navigateTo({ url: item.path })
    },
  },
}
</script>
