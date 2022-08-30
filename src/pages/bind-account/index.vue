<template>
  <view class="bind-account">
    <view class="form-item">选择身份</view>
    <view class="form-item-wrapper">
      <picker mode="selector" :range="userTypes" @change="userTypeChange" range-key="label">
        <text v-if="userTypes[userTypeIndex]">{{ userTypes[userTypeIndex].label }}</text>
        <text v-else>请选择身份</text>
      </picker>
    </view>
    <view class="form-item">账户密码</view>
    <input v-model="userAccount" placeholder-style="color:#a89e9e" placeholder="请输入账户" />
    <input v-model="userPassword" placeholder-style="color:#a89e9e" placeholder="请输入密码" />
    <view class="footer">
      <nan-button type="primary" @tap="bindAccount">确定</nan-button>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { setTitle } from '@/utils'

export default {
  name: 'user',
  components: {},
  data() {
    return {
      visible: false,
      userAccount: '',
      userPassword: '',
      userTypes: [
        {
          label: '身份1',
        },
        {
          label: '身份2',
        },
        {
          label: '身份3',
        },
      ],
      userTypeIndex: '',
    }
  },
  mounted() {
    setTitle({ title: '绑定账户' })
  },
  methods: {
    bindAccount() {},
    userTypeChange(e) {
      this.userTypeIndex = e.detail.value
    },
  },
}
</script>

<style lang="less">
.bind-account {
  padding: 20px 30px;

  .form-item {
    font-size: 26px;
    font-weight: 400;
    color: #333333;
    line-height: 37px;
    margin: 40px 0;

    &-wrapper {
      background: #f8f9fa;
      border-radius: 15px;
      padding: 22px 34px;
      line-height: 36px;
      font-size: 26px;
      color: #a89e9e;
    }
  }

  input {
    background-color: #ccc;
    background: #f8f9fa;
    border-radius: 15px;
    padding: 22px 34px;
    line-height: 36px;
    font-size: 26px;
    margin-bottom: 16px;
  }

  .footer {
    margin-top: 80px;
  }
}
</style>
