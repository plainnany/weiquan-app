<template>
  <view class="picker-container" @tap="showPicker">
    <slot>
      <view class="picker-value">{{ showValue || placeholder }}</view>
    </slot>

    <!-- 蒙层和选择器 -->
    <view class="mask" v-if="visible" @tap.stop="hidePicker"></view>
    <view class="picker-view" :class="{ 'picker-view-show': visible }">
      <view class="picker-header">
        <text class="cancel" @tap="onCancel">取消</text>
        <text class="confirm" @tap="onConfirm">确定</text>
      </view>
      <picker-view :value="currentIndex" class="picker-content" @change="onChange">
        <picker-view-column>
          <view class="item" v-for="(item, index) in rangeList" :key="index">
            {{ item.label }}
          </view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Picker',
  props: {
    // v-model绑定值
    modelValue: {
      type: [String, Number],
      default: '',
    },
    // 选项列表，格式：[{label: '显示文字', value: '实际值'}]
    rangeList: {
      type: Array,
      default: () => [],
    },
    // 占位符
    placeholder: {
      type: String,
      default: '请选择',
    },
  },

  data() {
    return {
      visible: false,
      currentIndex: [0],
      tempValue: null,
    }
  },

  computed: {
    showValue() {
      const item = this.rangeList.find(item => item.value === this.modelValue)
      return item ? item.label : ''
    },
  },

  methods: {
    showPicker() {
      this.visible = true
      // 根据当前值设置选中项
      const index = this.rangeList.findIndex(item => item.value === this.modelValue)
      this.currentIndex = [index > -1 ? index : 0]
    },

    hidePicker() {
      this.visible = false
    },

    onChange(e) {
      this.currentIndex = e.detail.value
      this.tempValue = this.rangeList[this.currentIndex[0]].value
    },

    onCancel() {
      this.hidePicker()
    },

    onConfirm() {
      this.$emit('update:modelValue', this.tempValue || this.rangeList[this.currentIndex[0]].value)
      this.hidePicker()
    },
  },
}
</script>

<style scoped>
.picker-container {
  position: relative;
}

.picker-value {
  min-height: 44rpx;
  line-height: 44rpx;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

.picker-view {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  transform: translateY(100%);
  transition: transform 0.3s;
  z-index: 1000;
}

.picker-view-show {
  transform: translateY(0);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
}

.cancel,
.confirm {
  font-size: 32rpx;
}

.cancel {
  color: #999;
}

.confirm {
  color: #007aff;
}

.picker-content {
  width: 100%;
  height: 400rpx;
}

.item {
  line-height: 80rpx;
  text-align: center;
}
</style>
