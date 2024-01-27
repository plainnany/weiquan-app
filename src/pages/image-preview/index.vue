<template>
  <view class="image-preview">
    <view class="image">
      <image :src="imageUrl" />
    </view>
    <nan-button class="btn" type="primary" @tap="save">保存</nan-button>
    <view class="common-toast" v-if="errorToast.visible && errorToast.message">
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
    }
  },
  mounted() {
    const { imageUrl } = Taro.getCurrentInstance().router.params
    this.imageUrl = imageUrl

    setTitle({ title: '收退货单' })
  },
  methods: {
    save() {
      Taro.downloadFile({
        url: this.imageUrl,
        success(res) {
          if (res.statusCode === 200) {
            // 下载成功，获取本地路径
            const localFilePath = res.tempFilePath
            // 保存图片到相册
            Taro.saveImageToPhotosAlbum({
              filePath: localFilePath,
              success() {
                this.showToast({ msg: '保存成功' })
              },
              fail(err) {
                this.showToast({ msg: '保存失败' })
                console.error('保存图片失败', err)
              },
            })
          } else {
            console.error('下载图片失败，statusCode：', res.statusCode)
          }
        },
        fail(err) {
          console.error('下载图片失败', err)
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
