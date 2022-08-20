<template>
  <view
    class="u-calendar-item__weeks-box"
    :class="{
      'u-calendar-item--disable':weeks.disable,
      'u-calendar-item--before-checked-x':weeks.beforeMultiple,
      'u-calendar-item--multiple': weeks.multiple,
      'u-calendar-item--after-checked-x':weeks.afterMultiple,
		}"
    @tap="choiceDate(weeks)"
  >
		<view
      class="u-calendar-item__weeks-box-item"
      :class="{
				'u-calendar-item--isDay-text': weeks.isDay,
				'u-calendar-item--checked':calendar.fullDate === weeks.fullDate && !weeks.isDay,
				'u-calendar-item--checked-range-text': checkHover,
				'u-calendar-item--before-checked':weeks.beforeMultiple,
				'u-calendar-item--multiple': weeks.multiple,
				'u-calendar-item--after-checked':weeks.afterMultiple,
				'u-calendar-item--disable':weeks.disable,
      }"
    >
			<text v-if="selected&&weeks.extraInfo" class="u-calendar-item__weeks-box-circle"></text>
			<text class="u-calendar-item__weeks-box-text">{{weeks.date}}</text>
		</view>
	</view>
</template>

<script>
export default {
  props: {
    weeks: {
      type: Object,
      default () {
        return {}
      }
    },
    calendar: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selected: {
      type: Array,
      default: () => {
        return []
      }
    },
    lunar: {
      type: Boolean,
      default: false
    },
    checkHover: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    choiceDate(weeks) {
      this.$emit('change', weeks)
    },
  },
}
</script>

<style lang="scss">
.u-calendar-item__weeks-box {
  flex: 1;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 3px 0;
}

.u-calendar-item__weeks-box-text {
  font-size: 32px;
}

.u-calendar-item__weeks-lunar-text {
  font-size: 32px;
  color: #37383d;
}

.u-calendar-item__weeks-box-item {
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 88px;
}


.u-calendar-item__weeks-box-circle {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background-color: red;

}

.u-calendar-item__weeks-box .u-calendar-item--disable {
  // background-color: rgba(249, 249, 249, $uni-opacity-disabled);
  color: #c2c2c2;
  cursor: default;
}

.u-calendar-item--isDay-text {
  color: #fff !important;
}

.u-calendar-item--isDay {
  background-color: #37383d;
  opacity: 0.8;
  color: #fff;
}

.u-calendar-item--extra {
  color: red;
  opacity: 0.8;
}

.u-calendar-item--checked {
  background-color: #fd734d;
  // border-radius: 50%;
  box-sizing: border-box;
  border: 6px solid #f2f6fc;
  color: #fff;
  opacity: 0.8;
}

.u-calendar-item--multiple .u-calendar-item--checked-range-text {
  color: #333;
}

.u-calendar-item--multiple {
  background-color:  #f2f6fc;
  // color: #fff;
  opacity: 0.8;
}

.u-calendar-item--multiple .u-calendar-item--before-checked {
  background-color: #ff9047;
  color: #fff;
   border-radius: 50%;
  box-sizing: border-box;
  border: 6px solid #f2f6fc;
}

.u-calendar-item--multiple .u-calendar-item--after-checked {
  background-color: #ff9047;;
  color: #fff;
   border-radius: 50%;
  box-sizing: border-box;
  border: 6px solid #f2f6fc;
}

.u-calendar-item--before-checked-x {
  background-color: #f2f6fc;
}

.u-calendar-item--after-checked-x {
  background-color: #f2f6fc;
}
</style>
