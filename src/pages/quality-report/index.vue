<template>
  <view class="quality-page">
    <view class="quality-selection">
      <picker mode="selector" :range="qualityTypes" @change="qualityTypeChange" range-key="label">
        <text>{{ qualityTypes[qualityIndex].label }}</text>
      </picker>
      <image class="arrow" :src="arrowIcon" />
    </view>
    <view class="quality-selection">
      <picker mode="selector" :range="productList" @change="productChange" range-key="productName">
        <text v-if="productList[productIndex]">{{ productList[productIndex].productName }}</text>
        <text v-else>请选择商品</text>
      </picker>
      <image class="arrow" :src="arrowIcon" />
    </view>
    <view class="quality-search" v-if="qualityIndex === 0">
      <view class="flex-between-center">
        <icon class="search-icon" type="search" size="16" />
        <input v-model="batchCode" placeholder="请输入商品批次号" />
      </view>
      <view class="search-btn" @tap="onSearch">查询</view>
    </view>
    <view class="quality-search" v-if="qualityIndex === 1">
      <nan-button type="primary" @tap="onSearch()">查询</nan-button>
    </view>
    <view v-if="!qualityList.length">
      <image class="quality-img" src="http://foodservice-main.oss-cn-hangzhou.aliyuncs.com/old/zjbg.png" mode=""></image>
    </view>
    <view class="quality-result">
      <view class="quality-list">
        <view class="quality-list-item" v-for="(item, index) in qualityList" :key="index">
          <image :src="item" mode="widthFix" @load="e => loadImage(e, index)" />
          <nan-button type="primary" @tap="onDownload(item)">第{{ index + 1 }}页下载  {{heightList[index]}}</nan-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'
import Taro from '@tarojs/taro'
import { setTitle } from '@/utils'
import arrowIcon from '@/images/arrow-down.png'

export default {
  components: {},
  data() {
    return {
      arrowIcon,
      qualityTypes: [
        {
          label: '出厂检验报告',
          inspectionType: '01',
        },
        {
          label: '外检报告',
          inspectionType: '02', // 外检不用批次号
        },
      ],
      productList: [],
      qualityList: [],
      qualityIndex: 0,
      batchCode: '',
      productIndex: '',
      productCode: '',
      heightList: [],
    }
  },
  mounted() {
    setTitle({ title: '检验报告单' })
    this.getProductList()
  },
  methods: {
    onSearch() {
      if (!this.productCode) {
        Taro.showToast({
          icon: 'error',
          title: '请选择产品',
        })
        return
      }

      if (this.qualityIndex === 0) {
        if (!this.batchCode) {
          Taro.showToast({
            icon: 'error',
            title: '请输入批次号',
          })
          return
        }
      }
      this.getQualityList()
    },
    getProductList() {
      this.$API.getComplaintProductList().then(data => {
        this.productList = data
        if (data.length > 0) {
          this.productIndex = 0
          this.productCode = data[0].productCode
        }
      })
    },
    getQualityList() {
      this.$API
        .getQualityReport({
          productCode: this.productCode, // 品项编码
          batchCode: this.qualityIndex === 0 ? this.batchCode : '', // 批次号
          inspectionType: this.qualityTypes[this.qualityIndex].inspectionType,
        })
        .then(data => {
          this.qualityList = data || []
        })
    },
    productChange(e) {
      this.productIndex = parseInt(e.detail.value)
      this.productCode = this.productList[this.productIndex].productCode
    },
    qualityTypeChange(e) {
      this.qualityIndex = parseInt(e.detail.value)
    },
    onDownload(url) {
      Taro.downloadFile({
        url,
        success(res) {
          const { tempFilePath } = res
          Taro.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success() {
              Taro.showToast({
                title: '下载成功',
              })
            },
          })
        },
      })
    },
    loadImage(e, index) {
      const { width, height } = e.target
      this.heightList[index] = height + 'px'
      debugger
    },
  },
}
</script>
