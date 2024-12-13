<template>
  <picker :class="className" mode="selector" :range="rangeList" range-key="label" @change="onChange">
    <text v-if="tempValue">{{ showValue }}</text>
    <text v-else>{{ placeholder }}</text>
  </picker>
</template>

<script>
export default {
  name: 'ddd',
  props: {
    // v-model绑定值
    value: {
      type: [String, Number],
      default: '',
    },
    // // 选项列表，格式：[{label: '显示文字', value: '实际值'}]
    rangeList: {
      type: Array,
      default: () => [],
    },
    // // 占位符
    placeholder: {
      type: String,
      default: '请选择',
    },
    rangeKey: {
      type: String,
    },
    className: String,
  },

  data() {
    return {
      currentIndex: 0,
      tempValue: null,
    }
  },
  watch: {
    value() {
      this.tempValue = this.value
    },
  },
  created() {
    this.tempValue = this.value
  },

  computed: {
    showValue() {
      const item = this.rangeList?.find(item => item.value === this.tempValue)
      return item ? item.label : ''
    },
  },

  methods: {
    showPicker() {
      // 根据当前值设置选中项
      const index = this.rangeList.findIndex(item => item.value === this.value)
      this.currentIndex = [index > -1 ? index : 0]
    },

    onChange(e) {
      this.currentIndex = e.detail.value
      this.tempValue = this.rangeList[this.currentIndex].value
      this.$emit('update', this.tempValue)
    },
  },
}
</script>
