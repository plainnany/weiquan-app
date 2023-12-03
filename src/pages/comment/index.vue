<template>
  <view class="comment-page">
    <view class="comment-card">
      <view class="comment-page-item">
        <view class="comment-page-item-label">问题原因</view>
        <view class="input-wrapper">
          <picker mode="selector" :range="questions" @change="questionChange" range-key="dictname">
            <text v-if="checkedQuestion">{{ checkedQuestion }}</text>
            <text v-else>请选择问题原因</text>
          </picker>
        </view>
      </view>
      <view class="comment-page-item">
        <view class="comment-page-item-label">问题产品</view>
        <view class="input-wrapper">
          <picker mode="selector" :range="productList" @change="productChange" range-key="productName">
            <text v-if="checkedProduct">{{ checkedProduct }}</text>
            <text v-else>请选择问题产品</text>
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
        <view class="comment-page-item-label">问题说明</view>
        <view class="input-wrapper">
          <textarea v-model="form.description" placeholder="请输入问题说明" />
        </view>
      </view>
      <view class="comment-page-item">
        <view class="comment-page-item-label">上传凭证 <text style="color: #666">(请拍摄产品生产日期和异常图片)</text></view>
        <view class="comment-page-upload">
          <view class="comment-page-image-item" v-for="(image, index) in questionImages" :key="index">
            <image :src="image" mode="" />
          </view>
          <view class="comment-page-upload-image" @tap="uploadImage" v-if="canEdit"> + </view>
        </view>
      </view>
      <view class="comment-page-item">
        <view class="comment-page-item-label">上传视频凭证 <text style="color: #666">(最多一个视频且时长不长于15s)</text></view>
        <view class="comment-page-upload">
          <view class="comment-page-image-item" v-if="videoUrl">
            <video v-if="videoUrl" :src="videoUrl" :show-play-btn="true"></video>
          </view>
          <!-- <video
            src="https://foodservice-main.oss-cn-hangzhou.aliyuncs.com/2023/12/1701614391987.mp4?Expires=2016974391&OSSAccessKeyId=LTAI5tRyZsjXskyXUBYkyJ2Y&Signature=1EB%2FvOLoHcdCcvjh3TlgwUqNK%2Bo%3D"
          /> -->
          <view class="comment-page-upload-image" @tap="uploadVideo" v-if="canEdit"> + </view>
        </view>
      </view>
    </view>
    <view class="comment-page-footer" v-if="canEdit">
      <nan-button type="primary" @tap="submit" :disabled="btnDisabled" :loading="btnLoading">提交评价</nan-button>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './index.less'
import { setTitle } from '@/utils'
import locationIcon from '@/images/location.png'
import backIcon from '@/images/user/back.png'
import { BASE_URL } from '@/const'

export default {
  components: {},
  data() {
    return {
      form: {
        question: '',
        number: '',
        description: '',
        dictid: '',
        productCode: '',
      },
      questions: [],
      checkedQuestion: '',
      productList: [],
      checkedProduct: '',
      questionImages: [],
      locationIcon,
      backIcon,
      detailData: {},
      complainCode: '',
      btnLoading: false,
      videoUrl: '',
    }
  },
  computed: {
    canEdit() {
      return !this.complainCode
    },
    btnDisabled() {
      const { description, dictid, number, productCode } = this.form
      if (!description || !dictid || !number || !productCode || !this.questionImages.length || !this.videoUrl) {
        return true
      }
      return false
    },
  },
  created() {
    this.$instance = Taro.getCurrentInstance()
  },
  mounted() {
    setTitle({ title: '评价' })
    const { code } = this.$instance.router.params
    if (code) {
      this.complainCode = code
      this.getComplaintDetail()
    } else {
      this.getProductList()
      this.getComplainType()
    }
  },
  methods: {
    getComplaintDetail() {
      this.$API
        .getComplaintDetail({
          complainCode: this.complainCode,
        })
        .then(data => {
          data = data || {}
          this.detailData = data
          this.questions = [
            {
              label: data.dictname,
              id: data.dictid,
            },
          ]
          this.productList = [
            {
              productName: data.productName,
              productCode: data.productCode,
            },
          ]
          this.questionImages = data.imageUrl
          this.checkedQuestion = data.dictname
          this.checkedProduct = data.productName
          this.form.description = data.complainDetail
          this.form.number = data.num
        })
    },
    getProductList() {
      this.$API.getComplaintProductList().then(data => {
        this.productList = data
      })
    },
    getComplainType() {
      this.$API
        .getComplainType({
          state: '01',
        })
        .then(data => {
          data = data || []
          this.questions = data
        })
    },
    questionChange(e) {
      const { dictname, dictid } = this.questions[e.detail.value]
      this.checkedQuestion = dictname
      this.form.dictid = dictid
    },
    productChange(e) {
      const { productName, productCode } = this.productList[e.detail.value]
      this.checkedProduct = productName
      this.form.productCode = productCode
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
          url: BASE_URL + '/api/files/upload.ns', //仅为示例，非真实的接口地址
          filePath: tempFilePath,
          name: 'file',
          formData: {
            user: 'test',
          },
          success: res => {
            const response = JSON.parse(res.data)
            const url = (response.data || [])[0]?.url
            if (!url) return
            this.questionImages.push(url)
          },
          fail: err => {
            console.log(err)
          },
        })
      })
    },
    uploadVideo() {
      Taro.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: res => {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          const tempFilePath = res.tempFilePath
          debugger
          Taro.uploadFile({
            url: BASE_URL + '/api/files/upload.ns', //仅为示例，非真实的接口地址
            filePath: tempFilePath,
            name: 'file',
            formData: {
              user: 'test',
            },
            success: res => {
              const response = JSON.parse(res.data)
              const url = (response.data || [])[0]?.url
              if (!url) return
              debugger
              this.videoUrl = url
            },
            fail: err => {
              console.log(err)
            },
          })
        },
        fail: function(err) {
          console.log(`请确保微信权限都已开启,不然无法正常调用相机或相册`, err)
        },
        cancel: function(res) {
          console.log('取消视频选择', res)
        },
      })
    },
    submit() {
      const { description, dictid, number, productCode } = this.form
      this.btnLoading = true
      this.$API
        .submitComplain({
          complainDetail: description,
          imgUrl: this.questionImages,
          dictid,
          num: number,
          productCode,
        })
        .then(data => {
          if (data) {
            Taro.navigateTo({ url: '/pages/custom-comment/index' })
          }
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
  },
}
</script>
