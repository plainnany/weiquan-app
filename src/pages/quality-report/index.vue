<template>
  <view class="quality-page">
    <view class="quality-selection">
      <NPicker :value="qualityType" :rangeList="qualityTypes" @update="qualityTypeChange" />
      <image class="arrow" :src="arrowIcon" />
    </view>
    <view class="quality-selection">
      <NPicker :value="productCode" :rangeList="productList" @update="value => (productCode = value)" />
      <image class="arrow" :src="arrowIcon" />
    </view>
    <view class="quality-selection" v-if="qualityType === '01'">
      <NPicker :value="factoryCode" :rangeList="factoryList" placeholder="请选择出货工厂" @update="value => (factoryCode = value)" />
      <image class="arrow" :src="arrowIcon" />
    </view>
    <view class="quality-search" v-if="qualityType === '01'">
      <view class="flex-between-center">
        <icon class="search-icon" type="search" size="16" />
        <input v-model="batchCode" placeholder="请输入商品批次号" />
      </view>
      <view class="search-btn" @tap="onSearch">查询</view>
    </view>
    <view class="quality-search-action" v-if="qualityType === '02'">
      <nan-button type="primary" @tap="onSearch()" class="query-action">查询</nan-button>
    </view>
    <view v-if="!qualityList.length">
      <image class="quality-img" src="http://foodservice-main.oss-cn-hangzhou.aliyuncs.com/old/zjbg.png" mode=""></image>
    </view>
    <view class="quality-result">
      <view class="quality-list">
        <view class="quality-list-item" v-for="(item, index) in qualityList" :key="index">
          <image :src="item.imageUrl" mode="widthFix" @load="e => loadImage(e, index)" />
          <nan-button type="primary" @tap="onDownload(item, index + 1)" :loading="item.downloading">第{{ index + 1 }}页下载 </nan-button>
        </view>
      </view>
    </view>
    <view class="common-toast" v-show="errorToast.visible && errorToast.message">
      <text>{{ errorToast.message }}</text></view
    >
  </view>
</template>

<script>
import './index.less'
import Taro from '@tarojs/taro'
import { setTitle } from '@/utils'
import arrowIcon from '@/images/arrow-down.png'
import ToastMixin from '@/mixin/toast'
import { BASE_URL } from '@/const'
import NPicker from '@/components/picker'

export default {
  components: {
    NPicker,
  },
  mixins: [ToastMixin],
  data() {
    return {
      arrowIcon,
      qualityTypes: [
        {
          label: '出厂检验报告',
          value: '01',
        },
        {
          label: '外检报告',
          value: '02', // 外检不用批次号
        },
      ],
      qualityType: '01',

      productList: [],
      productCode: '',

      qualityList: [],
      batchCode: '',
      factoryList: [],
      factoryCode: '',
    }
  },
  mounted() {
    setTitle({ title: '检验报告单' })
    this.getProductList()
    this.getFactoryList() // 获取工厂信息
  },
  methods: {
    onSearch() {
      if (!this.productCode) {
        this.showToast({
          msg: '请选择产品',
        })
        return
      }

      if (this.qualityType === '01') {
        if (!this.batchCode) {
          this.showToast({
            msg: '请输入批次号',
          })
          return
        }
        if (!this.factoryCode) {
          return this.showToast({
            msg: '请选择工厂！',
          })
        }
      }
      this.getQualityList()
    },
    getProductList() {
      this.$API.getComplaintProductList().then(data => {
        this.productList = data.map(v => ({
          ...v,
          label: v.productName,
          value: v.productCode,
        }))
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
          batchCode: this.qualityType === '01' ? this.batchCode : '', // 批次号
          factoryCode: this.qualityType === '02' ? this.factoryCode : '', // 出货工厂
          inspectionType: this.qualityType,
        })
        .then(data => {
          this.qualityList = (data || []).map(v => ({
            imageUrl: v,
            downloading: false,
          }))
        })
        .catch(err => {
          this.showToast(err)
        })
    },
    qualityTypeChange(value) {
      this.qualityType = value
    },
    getFactoryList() {
      this.$API.getFactory().then(data => {
        this.factoryList = data.map(v => ({
          ...v,
          label: v.factoryName,
          value: v.factoryCode,
        }))
      })
    },
    onDownload(item, index) {
      if (item.downloading) return
      item.downloading = true
      const filename = new Date().getTime() + '.jpg'
      const savePath = wx.env.USER_DATA_PATH + '/' + filename

      wx.downloadFile({
        // header: 'content-type: image/jpg',
        // url: BASE_URL + '/downFile.ns?curl=' + item.imageUrl,
        url: item.imageUrl,
        // filePath: savePath,
        success: res => {
          item.downloading = false
          const { filePath, tempFilePath } = res
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: () => {
              this.showToast({
                msg: `保存第${index}页质检报告成功！`,
              })
            },
          })
        },
        fail: function(err) {
          console.log(err)
          item.downloading = false
          wx.getSetting({
            success: function(res) {
              // 判断否有保存权限
              if (!res.authSetting['scope.writePhotosAlbum']) {
                wx.showModal({
                  title: '提示',
                  content: '需要获取图片权限哦',
                  success: function(res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success(res) {
                          console.log(res)
                        },
                        fail(res) {
                          console.log(res)
                        },
                      })
                    }
                  },
                })
              }
            },
          })
        },
      })
    },
    loadImage(e, index) {
      // const { width, height } = e.target
      // this.heightList[index] = height + 'px'
    },
  },
}
</script>
