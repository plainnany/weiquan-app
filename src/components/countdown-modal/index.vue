<template>
  <view class="countdown-modal" v-if="visible">
    <view class="modal-mask" @tap="handleClose"></view>
    <view class="modal-content">
      <view class="countdown-modal-close" @tap="handleClose">
        <view>关闭</view>
        <view>|</view>
        <view class="countdown" v-if="countdown > 0">{{ countdown }}s</view>
      </view>
      <view class="modal-body" @tap="handleClick">
        <image :src="imageUrl" mode="" class="modal-image" />
      </view>
    </view>
  </view>
</template>

<script>
import closeIcon from '@/images/close.png'
import Taro from '@tarojs/taro'

export default {
  name: 'CountdownModal',
  data() {
    return {
      closeIcon,
      countdown: 0,
      timer: null,
      imageUrl: '',
      productId: '',
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.initModal()
      } else {
        this.clearTimer()
      }
    },
  },
  methods: {
    initModal() {
      // 从接口获取弹窗数据
      this.imageUrl = this.info.productImg
      this.countdown = parseInt(this.info.times)
      this.productId = this.info.productCode
      this.startCountdown()
    },

    /**
     * 处理倒计时逻辑
     * 从初始时间开始倒计时，每秒减1，直到为0时关闭弹窗
     */
    startCountdown() {
      this.clearTimer()
      // 确保先清除之前的计时器
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }

      const tick = () => {
        // 显示当前倒计时值
        if (this.countdown > 0) {
          // 一秒后再次执行tick函数
          this.timer = setTimeout(() => {
            this.countdown--
            tick()
          }, 1000)
        } else {
          // 倒计时结束，关闭弹窗
          this.handleClose()
        }
      }

      // 开始倒计时
      tick()
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
        this.handleClose()
      }
    },
    handleClose() {
      this.clearTimer()
      this.$emit('update:visible', false)
    },
    handleClick() {
      if (this.productId) {
        this.clearTimer()
        Taro.navigateTo({
          url: `/pages/product-detail/index?id=${this.productId}&tel=${this.info.tel}`,
        })
      }
    },
  },
  beforeDestroy() {
    this.clearTimer()
  },
}
</script>

<style lang="less">
.countdown-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;

  .modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80vh;
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;
  }

  &-close {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    z-index: 1;
    color: rgba(255, 255, 255, 0.7);
    background: rgba(0, 0, 0, 0.9);
    border-radius: 20rpx;
    display: flex;
    padding: 12px 18px;
    font-size: 32rpx;
    align-items: center;
    gap: 10px;
  }

  .modal-body {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .modal-image {
    width: 100%;
    height: 100%;
  }
}
</style>
