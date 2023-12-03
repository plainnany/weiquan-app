<template>
  <view class="account-manage">
    <view class="account-manage-card" v-for="(group, index) in items" :key="index">
      <view class="account-manage-item" v-for="item in group" :key="item.key" @tap="handleChange(item)">
        <view>{{ item.name }}</view>
        <view v-if="item.key === 'headPic'">
          <image :src="userInfo.headPic" v-if="userInfo.headPic" mode="" />
        </view>
        <view v-else class="right">
          {{ userInfo[item.key] }}
          <image :src="item.icon" mode="" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import './index.less'
import { setTitle } from '@/utils'
import { BASE_URL } from '@/const'
import backImg from '@/images/user/back.png'

export default {
  components: {},
  data() {
    return {
      items: [
        [
          {
            name: '头像',
            key: 'headPic',
            needChange: true,
          },
        ],
        [
          {
            name: '昵称',
            key: 'customerName',
          },
          {
            name: '地址',
            key: 'customerAddress',
          },
        ],
        [
          {
            name: '收货人',
            key: 'customerLinkMan',
            needChange: true,
            icon: backImg,
          },
          {
            name: '收货人电话',
            key: 'consigneeLink',
            needChange: true,
            icon: backImg,
          },
          {
            name: '联系人电话',
            key: 'customerLinkTel',
            needChange: true,
            icon: backImg,
          },
        ],
      ],
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
  },
  mounted() {
    setTitle({ title: '账户管理' })
  },
  methods: {
    handleChange(item) {
      if (item.key === 'headPic') {
        this.uploadImage()
      } else if (item.needChange) {
        Taro.navigateTo({ url: `/pages/account-modify/index?key=${item.key}&title=${item.name}` })
      }
    },
    uploadImage() {
      Taro.chooseImage({
        count: 1, // 多可以选择的图片张数
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
            this.userInfo.headPic = url
            this.$store.commit('setUserInfo', this.userInfo)
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
