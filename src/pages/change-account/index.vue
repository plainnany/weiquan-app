<template>
  <view class="change-account">
    <view
      class="user-list-wrapper"
      :data-index="index"
      v-for="(user, index) in accountList"
      :key="index"
      @tap="changeUser(item)"
      @touchstart="e => touchStart(e, user)"
      @touchmove="e => touchMove(e, user)"
      @touchend="e => touchEnd(e, user)"
    >
      <view class="user-list" :style="user.style">
        <view class="user-avatar">
          <image :src="user.headPic" mode="" />
        </view>
        <view class="user-info">
          <view
            >{{ user.customerName }}
            <text :class="['tag', { assistant: user.userType === 1, manager: user.userType === 2 }]">{{
              userTypeMap[user.userType]
            }}</text></view
          >
          <view>ID: {{ user.customerCode }}</view>
        </view>
        <view class="user-current" v-if="isCurrentUser(user) && !showDelete(user)">
          <image :src="checkIcon" mode="" />
        </view>
      </view>
      <view class="delete-btn" :data-index="index" v-if="showDelete(user)" @tap="deleteUser(index)">
        删除
      </view>
    </view>
    <view class="add-user user-list" @tap="addUser">
      <view class="user-avatar">
        <image :src="addIcon" mode="" />
      </view>
      <view>添加账号</view>
    </view>

    <nan-modal :visible="visible" title="添加账号" confirmText="确认" @cancel="onCancel" @confirm="onConfirm">
      <view class="form-item">选择身份</view>
      <view class="form-item-wrapper">
        <picker mode="selector" :range="accountTypes" @change="accountTypeChange" range-key="label">
          <text v-if="checkedAccountType">{{ checkedAccountType }}</text>
          <text v-else>请选择身份</text>
        </picker>
      </view>
      <view class="form-item">账户密码</view>
      <input v-model="customerCode" placeholder-style="color:#a89e9e" placeholder="请输入账户名" />
      <input v-model="customerPassword" type="password" placeholder-style="color:#a89e9e" placeholder="请输入密码" />
    </nan-modal>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { AES } from 'crypto-js'
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
      accountList: [],
      userTypeMap: {
        1: '店长',
        2: '店员',
      },
      delBtnWidth: 70,
      startX: 0,
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
    }
  },
  computed: {
    isCurrentUser() {
      return item => item.useflg === '01'
    },
    showDelete() {
      return item => item.style && parseInt(item.style.left) !== 0
    },
  },
  mounted() {
    setTitle({ title: '切换账号' })
    this.getBindShopList()
    try {
      const unionId = Taro.getStorageSync('unionId')
      this.unionId = unionId
    } catch (e) {}
  },
  methods: {
    getBindShopList() {
      this.$API
        .getBindShopList({
          unionId: this.unionId,
        })
        .then(data => {
          this.accountList = data
        })
    },
    changeUser(item) {
      this.$API
        .useShop({
          unionId: this.unionId,
          customerCode: item.customerCode,
        })
        .then(data => {
          if (data) {
            Taro.setStorageSync('token', item.token)
          }
        })
    },
    addUser() {
      this.visible = true
    },
    accountTypeChange(e) {
      this.checkedAccountType = this.accountTypes[e.detail.value].label
      this.userType = this.accountTypes[e.detail.value].userType
    },
    deleteUser() {
      this.$API
        .unbindShop({
          unionId: this.unionId,
          customerCode: item.customerCode,
        })
        .then(data => {
          if (data) {
            this.accountList.splice(index, 1)
          }
        })
    },
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
            this.accountList.push(data)
          }
        })
    },
    touchStart(e, user) {
      if (this.isCurrentUser(user)) return
      if (e.touches.length == 1) {
        this.startX = e.touches[0].clientX
      }
    },
    touchMove(e, user) {
      if (this.isCurrentUser(user)) return
      if (e.touches.length == 1) {
        const moveX = e.touches[0].clientX
        const disX = this.startX - moveX
        const delBtnWidth = this.delBtnWidth
        let txtStyle = null
        if (disX == 0 || disX < 0) {
          txtStyle = { left: 0 }
        } else if (disX > 0) {
          txtStyle = 'left:-' + +'px'
          txtStyle = { left: `-${disX}px` }
          if (disX >= delBtnWidth) {
            txtStyle = { left: `-${delBtnWidth}px` }
          }
        }
        const index = e.currentTarget.dataset.index
        this.$set(this.accountList[index], 'style', txtStyle)
      }
    },
    touchEnd(e, user) {
      if (this.isCurrentUser(user)) return
      if (e.changedTouches.length == 1) {
        const endX = e.changedTouches[0].clientX
        const disX = this.startX - endX
        const delBtnWidth = this.delBtnWidth
        const txtStyle = disX > delBtnWidth / 2 ? { left: `-${delBtnWidth}px` } : { left: 0 }
        const index = e.currentTarget.dataset.index
        this.$set(this.accountList[index], 'style', txtStyle)
      }
    },
  },
}
</script>
