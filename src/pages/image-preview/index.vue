<template>
  <view class="image-preview">
    <view class="image">
      <image :src="imageUrl" />
    </view>
    <nan-button class="btn" type="primary" @tap="save" :loading="downloading">保存</nan-button>
    <view class="common-toast" v-show="errorToast.visible && errorToast.message">
      <text>{{ errorToast.message }}</text></view
    >
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { setTitle } from '@/utils'
import ToastMixin from '@/mixin/toast'

export default {
  components: {},
  mixins: [ToastMixin],
  data() {
    return {
      imageUrl: '',
      downloading: false,
    }
  },
  mounted() {
    const { imageUrl, type } = Taro.getCurrentInstance().router.params
    this.imageUrl = decodeURIComponent(imageUrl)
    this.type = type === 'undefined' ? '' : type
    setTitle({ title: '收退货单' })
  },
  methods: {
    save() {
      if (this.downloading) return
      this.downloading = true
      Taro.downloadFile({
        url: this.imageUrl,
        success: res => {
          this.downloading = false

          if (res.statusCode === 200) {
            // 下载成功，获取本地路径
            const localFilePath = res.tempFilePath
            // 收货单 01，退货单 02
            const type = this.type === '01' ? '收货单' : '退货单'
            // 保存图片到相册
            Taro.saveImageToPhotosAlbum({
              filePath: localFilePath,
              success: () => {
                this.showToast({ msg: '保存' + type + '成功!' })
              },
              fail: err => {
                this.authFail()
                // this.showToast({ msg: '保存失败' })
                console.error('保存图片失败', err)
              },
            })
          } else {
            console.error('下载图片失败，statusCode：', res.statusCode)
          }
        },
        fail: err => {},
      })
    },
    authFail(err) {
      this.downloading = false
      wx.getSetting({
        success: function(res) {
          // 判断否有保存权限
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.showModal({
              title: '提示',
              content: '需要获取图片权限',
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
  },
}
</script>

<style lang="less">
.image-preview {
  height: 100%;
  padding: 24px;

  .image {
    image {
      width: 100%;
      height: calc(100vh - 150px);
    }
  }
}
</style>
