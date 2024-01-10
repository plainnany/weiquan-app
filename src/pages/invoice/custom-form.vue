<template>
  <view class="invoice-form">
    <view class="invoice-form-item">
      <view class="label">收件人</view>
      <view class="content">
        <input class="input-item" v-model="invoiceForm.familyName" placeholder="请输入姓" />
        <text class="divider">|</text>
        <input class="input-item" v-model="invoiceForm.customerName" placeholder="请输入名" />
      </view>
    </view>
    <view class="invoice-form-item">
      <view class="label">地址</view>
      <view class="content">
        <picker class="input-item" mode="selector" :range="provinceList" level="city" range-key="name" @change="provinceChange">
          {{ invoiceForm.province || '请选择省' }}
          <image :src="arrow" class="arrow-down" />
        </picker>
        <picker class="input-item" mode="selector" :range="cityList" range-key="name" @change="cityChange">
          {{ invoiceForm.city || '请选择市' }}
          <image :src="arrow" class="arrow-down" />
        </picker>
        <input class="address" v-model="invoiceForm.detailAddress" placeholder="请输入详细地址" />
      </view>
    </view>
    <view class="invoice-form-item">
      <view class="label">电话</view>
      <view class="content">
        <input v-model="phone" @input="changePhone" placeholder="请输入电话号码" />
      </view>
    </view>
  </view>
</template>
<script>
import arrow from '@/images/arrow-down.png'

export default {
  props: {
    invoiceForm: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      province: {},
      city: {},
      provinceList: [],
      cityList: [],
      phone: '',
      arrow,
    }
  },
  mounted() {
    this.phone = this.invoiceForm.phone
    this.getChinaMap()
  },
  methods: {
    getChinaMap(pid = 0) {
      this.$API
        .getChinaMap(
          {
            pid,
          },
          {
            needLoading: false,
          }
        )
        .then(data => {
          if (pid === 0) {
            this.provinceList = data
          } else {
            this.city = {}
            this.cityList = data
          }
        })
    },
    provinceChange(e) {
      const index = e.target.value
      const province = this.provinceList[index]
      this.invoiceForm.province = province.name
      this.invoiceForm.provinceId = province.id
      this.getChinaMap(province.id)
    },
    cityChange(e) {
      const index = e.target.value
      this.city = this.cityList[index]
      this.invoiceForm.city = this.city.name
    },
    changePhone(e) {
      if (!/\d+/.test(e.detail.value)) {
        this.phone = ''
      } else {
        this.phone = e.detail.value
      }
      this.invoiceForm.phone = this.phone
    },
  },
}
</script>
