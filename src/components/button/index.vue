<template>
  <button :class="type" :disabled="disabled" :loading="loading" @tap="handleClick" v-bind="$attrs" class="nan-button">
    <slot></slot>
  </button>
</template>

<script>
import './index.less'
export default {
  name: 'nan-button',
  props: {
    loading: Boolean,
    type: String,
    disabled: Boolean,
  },
  data() {
    return {}
  },
  methods: {
    handleClick() {
      if (this.loading || this.disabled) {
        return
      }

      this.$emit('tap')
    },
  },
}
</script>
