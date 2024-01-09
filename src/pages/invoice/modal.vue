<template>
  <view class="invoice-modal" :class="{ active: visible }">
    <view class="invoice-modal-mask" @tap="handleCancel"></view>
    <view class="invoice-modal-container" :class="{ 'full-screen': fullScreen }">
      <view class="invoice-modal-header" v-if="title">
        <text>
          {{ title }}
        </text>
        <view class="invoice-modal-close" @tap="handleCancel">
          <image :src="closeIcon" mode="" />
        </view>
      </view>
      <view class="invoice-modal-content">
        <slot></slot>
      </view>
      <view class="invoice-modal-footer">
        <view class="confirm" @tap="handleConfirm">{{ confirmText }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import './modal.less'
import closeIcon from '@/images/close.png'
export default {
  props: {
    visible: Boolean,
    title: String,
    cancelText: String,
    confirmText: String,
    fullScreen: Boolean,
  },
  data() {
    return {
      closeIcon,
    }
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
