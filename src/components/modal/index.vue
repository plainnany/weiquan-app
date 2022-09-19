<template>
  <view class="nan-modal" :class="{ active: visible }">
    <view class="nan-modal-mask" @tap="handleCancel"></view>
    <view class="nan-modal-container" :class="{ 'full-screen': fullScreen }">
      <view class="nan-modal-header" v-if="title">
        <text>
          {{ title }}
        </text>
        <image :src="closeIcon" mode="" @tap="handleCancel" />
      </view>
      <view class="nan-modal-content">
        <slot></slot>
      </view>
      <view class="nan-modal-footer">
        <nan-button v-if="cancelText" type="plain" @tap="handleCancel">{{ cancelText }}</nan-button>
        <nan-button v-if="confirmText" type="primary" @tap="handleConfirm">{{ confirmText }}</nan-button>
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'
import closeIcon from '@/images/close.png'
export default {
  props: {
    visible: Boolean,
    title: String,
    cancelText: String,
    confirmText: String,
    fullScreen: Boolean,
    showClose: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return { closeIcon }
  },
  methods: {
    handleCancel() {
      this.$emit('cancel')
    },
    handleConfirm() {
      this.$emit('confirm')
    },
  },
}
</script>
