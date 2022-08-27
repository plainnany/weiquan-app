<template>
  <view class="comment-page">
    <view class="common-card">
      <view class="comment-page-item">
        <view class="comment-page-item-label">问题原因</view>
        <view class="input-wrapper">
          <picker mode="selector" :range="questions" @change="questionChange" range-key="label">
            <text v-if="questions[questionIndex]">{{ questions[questionIndex].label }}</text>
            <text v-else>请选择问题原因</text>
          </picker>
        </view>
      </view>
      <view class="comment-page-item">
        <view class="comment-page-item-label">问题产品</view>
        <view class="input-wrapper">
          <picker mode="selector" :range="questionProduct" range-key="label">
            请选择问题产品
          </picker>
        </view>
      </view>
      <view class="comment-page-item">
        <view class="comment-page-item-label">产品数量</view>
        <view class="input-wrapper">
          <input v-model="form.number" placeholder="请输入异常数量" />
        </view>
      </view>
      <view class="comment-page-item">
        <view class="comment-page-item-label">上传凭证 <text style="color: #666">(请拍摄产品生产日期和异常图片)</text></view>
        <view style="display:flex;">
          <view class="comment-page-image-item" v-for="(image, index) in questionImages" :key="index">
            <image :src="image" mode="" />
          </view>
          <view class="comment-page-upload-image" @tap="uploadImage"> + </view>
        </view>
      </view>
      <view class="comment-page-item">
        <view class="comment-page-item-label">问题说明</view>
        <view class="input-wrapper">
          <textarea v-model="form.info" placeholder="请输入问题说明" />
        </view>
      </view>
    </view>
    <view class="comment-page-footer">
      <nan-button type="primary" @tap="submit">提交评价</nan-button>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './index.less'
import { setTitle } from '@/utils'
import locationIcon from '@/images/location.png'
import backIcon from '@/images/user/back.png'

export default {
  components: {},
  data() {
    return {
      form: {
        question: '',
        reason: '',
        product: '',
        number: '',
        info: '',
      },
      questions: [
        {
          label: '问题1',
        },
        {
          label: '问题2',
        },
        {
          label: '问题3',
        },
      ],
      questionIndex: '',
      questionProduct: [
        {
          label: '问题产品1',
        },
        {
          label: '问题产品2',
        },
        {
          label: '问题产品3',
        },
      ],
      questionImages: [],
      locationIcon,
      backIcon,
    }
  },
  mounted() {
    setTitle({ title: '评价' })
  },
  methods: {
    submit() {
      console.log(this.form)
    },
    questionChange(e) {
      this.questionIndex = e.detail.value
      console.log(e.detail.value)
    },
    uploadImage() {
      Taro.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
        success: res => {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          this.handleUpload(tempFilePaths)
        },
        fail: function(err) {
          console.log(`请确保微信权限都已开启,不然无法正常调用相机或相册`, err)
        },
        cancel: function(res) {
          console.log('取消图片选择', res)
        },
      })
    },

    handleUpload(tempFilePaths) {
      tempFilePaths.forEach(tempFilePath => {
        Taro.uploadFile({
          url: '/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePath,
          name: 'file',
          formData: {
            user: 'test',
          },
          success: res => {
            const data = res.data
            console.log(data)
            this.questionImages.push(tempFilePath)
          },
          fail: err => {
            console.log(err)
          },
        })
      })
    },
  },
}
</script>
