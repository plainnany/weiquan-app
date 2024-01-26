<template>
  <view class="comment-page">
    <view v-if="type === 'done'" class="comment-page-done">
      <view class="phone" @tap="contact">
        <image :src="phoneIcon" mode="" />
        客服</view
      >
      <view class="done-card">
        <view class="comment-done-item">
          <view class="comment-done-label">
            处理情况
          </view>
          <view class="comment-done-text green">
            已处理
          </view>
        </view>
        <view class="comment-done-item">
          <view class="comment-done-label">
            处理措施
          </view>
          <view class="comment-done-text">
            {{ detailData.resolveSolution }}
          </view>
        </view>
        <view class="comment-done-item">
          <view class="comment-done-label">
            处理时间
          </view>
          <view class="comment-done-text">
            {{ detailData.resolveTime }}
          </view>
        </view>
      </view>
      <view class="done-card">
        <view class="comment-done-item">
          <view class="comment-done-label">
            客诉单号
          </view>
          <view class="comment-done-text">
            {{ detailData.complainCode }}
          </view>
        </view>
        <view class="comment-done-item">
          <view class="comment-done-label">
            客诉说明
          </view>
          <view class="comment-done-text">
            {{ detailData.complainDesc }}
          </view>
        </view>
        <view class="comment-done-item" v-if="detailData.imageUrl?.length">
          <view class="comment-done-label">
            客诉图片
          </view>
          <view class="comment-done-image">
            <image class="done-image" :src="item" v-for="item in detailData.imageUrl" :key="item"></image>
          </view>
        </view>
        <view class="comment-done-item">
          <view class="comment-done-label">
            客诉时间
          </view>
          <view class="comment-done-text">
            {{ detailData.complainDate }}
          </view>
        </view>
      </view>
    </view>
    <view class="comment-page-edit" v-else>
      <view class="comment-card">
        <view class="comment-page-item">
          <view class="comment-page-item-label">问题原因</view>
          <view class="input-wrapper">
            <picker mode="selector" :range="questions" @change="questionChange" range-key="dictname">
              <text v-if="checkedQuestion">{{ checkedQuestion }}</text>
              <text v-else>请选择问题原因</text>
              <image class="arrow" :src="arrowIcon" />
            </picker>
          </view>
        </view>
        <view class="comment-page-item">
          <view class="comment-page-item-label">问题产品</view>
          <view class="input-wrapper">
            <picker mode="selector" :range="productList" @change="productChange" range-key="productName">
              <text v-if="checkedProduct">{{ checkedProduct }}</text>
              <text v-else>请选择问题产品</text>
              <image class="arrow" :src="arrowIcon" />
            </picker>
          </view>
        </view>
        <view class="comment-page-item" v-if="form.dictid === '2.03'">
          <view class="comment-page-item-label">是否退回</view>
          <view class="input-wrapper">
            <picker mode="selector" :range="returnFlgRange" @change="returnFlgChange" range-key="label">
              <text v-if="form.returnFlg">{{ form.returnFlg === '01' ? '是' : '否' }}</text>
              <text v-else>请选择</text>
              <image class="arrow" :src="arrowIcon" />
            </picker>
          </view>
        </view>
        <view class="comment-page-item" v-if="form.dictid === '2.03'">
          <view class="comment-page-item-label">批次号</view>
          <view class="input-wrapper">
            <input v-model="form.batchCode" placeholder="请输入批次号" />
          </view>
        </view>
        <view class="comment-page-item">
          <view class="comment-page-item-label">产品数量</view>
          <view class="input-wrapper">
            <input type="number" v-model="form.number" placeholder="请输入异常数量" />
          </view>
        </view>
        <view class="comment-page-item">
          <view class="comment-page-item-label">问题说明</view>
          <view class="input-wrapper">
            <textarea v-model="form.description" :maxlength="maxlength" placeholder="请输入问题说明" />
            <view class="counter">{{ form.description.length || 0 }}/{{ maxlength }}</view>
          </view>
        </view>
        <view class="comment-page-item">
          <view class="comment-page-item-label">上传凭证 <text style="color: #666">(请拍摄产品生产日期和异常情况图片上传)</text></view>
          <view class="comment-page-upload">
            <view class="comment-page-image-item" v-for="(imageUrl, index) in questionImages" :key="index">
              <image :src="imageUrl" mode="" />
              <view class="comment-page-image-delete" @tap="deleteImage(index)">
                <image :src="deleteIcon" mode="" />
              </view>
            </view>
            <view class="comment-page-upload-image" @tap="uploadImage"> + </view>
          </view>
          <view class="comment-page-upload-tip">最多三张</view>
        </view>
        <view class="comment-page-item">
          <view class="comment-page-item-label">上传视频凭证 <text style="color: #666">(最多一个视频且时长不长于15秒)</text></view>
          <view class="comment-page-upload">
            <view class="comment-page-image-item" v-if="videoUrl">
              <video v-if="videoUrl" :src="videoUrl"></video>
              <view class="comment-page-image-delete" @tap="deleteVideo">
                <image :src="deleteIcon" mode="" />
              </view>
            </view>
            <view class="comment-page-upload-image" @tap="uploadVideo"> + </view>
          </view>
        </view>
      </view>
      <view class="comment-page-footer padding" v-if="type === 'add'">
        <nan-button type="primary" @tap="handleSubmit" :loading="btnLoading">确认提交</nan-button>
      </view>
      <view class="comment-page-footer" v-if="type === 'todo'">
        <view class="action-btn btn-delete" @tap="handleDelete">删除</view>
        <view class="action-btn" @tap="handleSubmit">保存</view>
      </view>
      <view class="common-toast" v-if="errorToast.visible && errorToast.message">
        <text>{{ errorToast.message }}</text></view
      >
    </view>
    <Modal
      :visible="confirmDialog.visible"
      v-if="confirmDialog.visible"
      :title="confirmDialog.title"
      cancelText="取消"
      confirmText="确定"
      @cancel="() => (confirmDialog = {})"
      @confirm="submit"
    >
      <view style="padding: 0 24rpx">{{ confirmDialog.content }}</view>
    </Modal>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './index.less'
import { setTitle } from '@/utils'
import locationIcon from '@/images/location.png'
import backIcon from '@/images/user/back.png'
import deleteIcon from '@/images/delete.svg'
import { BASE_URL } from '@/const'
import arrowIcon from '@/images/arrow-down.png'
import phoneIcon from '@/images/drive_phone.png'
import Modal from '../setting/modal.vue'

export default {
  components: { Modal },
  data() {
    return {
      arrowIcon,
      phoneIcon,
      form: {
        question: '',
        number: '',
        description: '',
        dictid: '',
        productCode: '',
        returnFlg: '',
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
      deleteIcon,
      type: '',
      returnFlgRange: [
        {
          label: '是',
          key: '01',
        },
        {
          label: '否',
          key: '02',
        },
      ],
      maxlength: 200,
      errorToast: {
        visible: false,
        message: '',
      },
      tip: '',
      confirmDialog: {},
    }
  },
  computed: {
    canEdit() {
      return !this.complainCode
    },
    btnDisabled() {
      const { description, dictid, number, productCode } = this.form
      if (!description) {
        this.tip = '问题说明不能为空'
        return true
      }
      if (!dictid) {
        this.tip = '问题产品不能为空'
        return true
      }

      if (!number) {
        this.tip = '数量不能为空'
        return true
      }
      if (!productCode) {
        this.tip = '产品不能为空'
        return true
      }
      if (!this.questionImages?.length) {
        this.tip = '图片不能为空'
        return true
      }

      return false
    },
  },
  created() {
    this.$instance = Taro.getCurrentInstance()
  },
  async mounted() {
    const { code, productName, type, customerOrderCode } = this.$instance.router.params
    this.type = type // 已处理、未处理
    setTitle({ title: type === 'done' ? '客诉详情' : '问题反馈' })
    this.productName = productName
    this.customerOrderCode = customerOrderCode
    await this.getProductList()
    await this.getComplainType()

    if (code) {
      this.complainCode = code
      this.getComplaintDetail()
    } else if (productName) {
      this.checkedProduct = productName
    }
  },
  methods: {
    showToast(err) {
      this.errorToast.visible = true
      this.errorToast.message = err.msg
      setTimeout(() => {
        this.errorToast = {
          visible: false,
          message: '',
        }
      }, 2000)
    },
    getComplaintDetail() {
      this.$API
        .getComplaintDetail({
          complainCode: this.complainCode,
        })
        .then(data => {
          data = data || {}
          this.detailData = data
          this.questionImages = data.imageUrl || []
          this.checkedQuestion = data.dictname
          this.form.description = data.complainDetail
          this.form.number = data.num
          this.form.dictid = data.dictid
          this.form.productCode = data.productCode
          this.form.returnFlg = data.returnFlg
          this.form.batchCode = data.batchCode
          this.videoUrl = data.vdUrl
          this.checkedProduct = data.productName || (this.productList.find(v => v.productCode === data.productCode) || {}).productName
        })
        .catch(err => this.showToast(err))
    },
    getProductList() {
      const params = this.customerOrderCode ? { customerOrderCode: this.customerOrderCode } : {}
      return this.$API.getComplaintProductList(params).then(data => {
        this.productList = data
        if (this.type === 'add') {
          this.checkedProduct = data[0]?.productName
          this.form.productCode = data[0]?.productCode
        }
      })
    },
    getComplainType() {
      return this.$API
        .getComplainType({
          state: '01',
        })
        .then(data => {
          data = data || []
          this.questions = data
          if (this.productName || this.type === 'add') {
            this.checkedQuestion = data[0].dictname
            this.form.dictid = data[0].dictid
          }
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
    returnFlgChange(e) {
      const { key } = this.returnFlgRange[e.detail.value]
      this.form.returnFlg = key
    },
    uploadImage() {
      Taro.chooseImage({
        count: 3, // 默认9
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
    deleteImage(index) {
      this.questionImages.splice(index, 1)
    },
    deleteVideo() {
      this.videoUrl = ''
    },
    handleSubmit() {
      if (this.form.dictid === '2.03') {
        this.confirmDialog = {
          title: '提示',
          content:
            '烦请留存异常产品至少三个工作日，我司会尽快联系您并与您确认问题产品寄送测样。请将异常产品标记区分良号存放。感谢您的合作!',
          visible: true,
        }
      } else {
        this.submit()
      }
    },
    submit() {
      if (this.btnDisabled) {
        return this.showToast({ msg: this.tip })
      }
      if (this.btnLoading) return
      const { description, dictid, number, productCode } = this.form
      this.btnLoading = true
      const params = {
        productName: this.checkedProduct || '',
        complainDetail: description,
        imgUrl: (this.questionImages || []).join(','),
        dictid,
        dictname: this.checkedQuestion,
        num: number,
        productCode,
        complainKind: '01',
        vdUrl: this.videoUrl,
      }
      if (this.form.dictid === '2.03') {
        params.returnFlg = this.form.returnFlg // 是否退回
        params.batchCode = this.form.batchCode // 批次号
      }
      if (this.complainCode) {
        params.complainCode = this.complainCode
      }

      this.$API
        .submitComplain(params)
        .then(() => {
          Taro.navigateBack({ delta: 1 })
        })
        .catch(err => {
          this.showToast(err)
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    handleDelete() {
      if (this.deleteStatus) return
      this.deleteStatus = true
      this.$API
        .deleteComplain({
          complainCode: this.complainCode,
        })
        .then(() => {
          Taro.navigateBack({ delta: 1 })
          // Taro.navigateTo({ url: '/pages/custom-comment/index' })
        })
        .catch(err => {
          this.showToast(err)
        })
        .finally(() => {
          this.deleteStatus = false
        })
    },
    contact() {
      if (!this.$store.state.userInfo.customerService) {
        Taro.showToast({
          title: '用户未登录，请先登录',
          icon: 'none',
        })

        setTimeout(() => {
          Taro.navigateTo({ url: '/pages/bind-account/index' })
        }, 2000)
        return
      }
      Taro.makePhoneCall({
        phoneNumber: this.$store.state.userInfo.customerService,
      })
    },
  },
}
</script>
