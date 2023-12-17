<template>
  <view class="setting-page">
    <view class="setting-page-card" v-for="(group, index) in list" :key="index">
      <view class="setting-page-item" v-for="item in group" :key="item.text" @tap="handleNav(item)">
        <view>
          {{ item.text }}
        </view>
        <view v-if="item.showBack">
          <image :src="backIcon" class="back-icon" mode="" />
        </view>
        <view v-if="item.showInfo">
          {{ item.info }}
        </view>
      </view>
    </view>
    <view class="setting-btn" @tap="handleQuit">
      退出登录
    </view>
    <Modal :visible="visible" title="退出登录" cancelText="取消" confirmText="确认" @cancel="() => (visible = false)" @confirm="onConfirm">
      <view>你确定要退出登录？</view>
    </Modal>
  </view>
</template>

<script>
import './index.less'
import backIcon from '@/images/user/back.png'
import fileIcon from '@/images/setting/file.png'
import lockIcon from '@/images/setting/lock.png'
// import noticeIcon from '@/images/setting/notice.png'
import warningIcon from '@/images/setting/warning.png'
import questionIcon from '@/images/setting/question.png'
import { setTitle } from '@/utils'
import Taro from '@tarojs/taro'
import Modal from './modal.vue'

export default {
  components: { Modal },
  data() {
    return {
      backIcon,
      list: [
        [
          {
            text: '问题反馈',
            icon: warningIcon,
            showBack: true,
            path: '/pages/comment/index?type=add',
          },
        ],
        [
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
            path: '/pages/change-password/index',
          },
        ],
        // {
        //   text: '清除缓存',
        //   icon: noticeIcon,
        //   showInfo: true,
        //   info: '23M',
        // },
        [
          {
            text: '当前版本',
            icon: questionIcon,
            showInfo: true,
            info: '1.1.0',
          },
        ],
      ],
      visible: false,
    }
  },
  computed: {},
  mounted() {
    setTitle({ title: '设置' })
  },
  methods: {
    handleQuit() {
      this.visible = true
    },
    onConfirm() {
      this.quit()
    },
    quit() {
      const unionId = Taro.getStorageSync('unionId')
      this.$API
        .unbindShop({
          unionId,
          customerCode: this.$store.state.userInfo.userId,
          userType: this.$store.state.userInfo.dianZhang ? 1 : 2,
        })
        .then(data => {
          if (data) {
            Taro.setStorageSync('token', '')
            this.$store.commit('setUserInfo', {})
            Taro.switchTab({ url: '/pages/index/index' })
          }
        })
    },
    handleNav(item) {
      if (item.path) {
        Taro.navigateTo({ url: item.path })
      }
    },
  },
}
</script>
