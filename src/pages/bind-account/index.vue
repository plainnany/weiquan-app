<template>
  <view class="bind-account">
    <view class="form-item">选择身份</view>
    <view class="form-item-wrapper">
      <picker mode="selector" :range="accountTypes" @change="accountTypeChange" range-key="label">
        <text v-if="checkedAccountType">{{ checkedAccountType }}</text>
        <text v-else>请选择身份</text>
      </picker>
    </view>
    <view class="form-item">账户密码</view>
    <input v-model="customerCode" placeholder-style="color:#a89e9e" placeholder="请输入账户" />
    <input v-model="customerPassword" type="password" placeholder-style="color:#a89e9e" placeholder="请输入密码" />
    <view class="footer">
      <nan-button type="primary" @tap="bindAccount">确定</nan-button>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { setTitle } from '@/utils'
import { AES } from 'crypto-js'

export default {
  name: 'user',
  components: {},
  data() {
    return {
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
  mounted() {
    setTitle({ title: '绑定账户' })
    try {
      const unionId = Taro.getStorageSync('unionId')
      this.unionId = unionId
    } catch (e) {}
  },
  methods: {
    bindAccount() {
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
            Taro.navigateBack({ delta: 1 })
          }
        })
    },
    accountTypeChange(e) {
      this.checkedAccountType = this.accountTypes[e.detail.value].label
      this.userType = this.accountTypes[e.detail.value].userType
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
