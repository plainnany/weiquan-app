<template>
  <view class="setting-modal" :class="{ active: visible }">
    <view class="setting-modal-mask" @tap="handleCancel"></view>
    <view class="setting-modal-container" :class="{ 'full-screen': fullScreen }">
      <view class="setting-modal-header" v-if="title">
        <text>
          {{ title }}
        </text>
      </view>
      <view class="setting-modal-content">
        <slot></slot>
      </view>
      <view class="setting-modal-footer">
        <view class="cancel btn" @tap="handleCancel">{{ cancelText }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import './modal.less'
export default {
  props: {
    visible: Boolean,
    title: String,
    cancelText: String,
    fullScreen: Boolean,
    showClose: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
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
