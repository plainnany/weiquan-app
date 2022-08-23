<template>
  <view class="address-page">
    <view class="address-card" v-for="(item, index) in addressList" :key="index">
      <view>
        <view class="address-title">
          <text>{{ item.name }}</text>
          <text>{{ item.phone }}</text>
        </view>
        <view class="address-detail">
          {{ item.address }}
        </view>
      </view>
      <view>
        <image :src="editIcon" />
      </view>
    </view>
    <view class="address-btn">
      <nan-button type="primary" @tap="add">添加新地址</nan-button>
    </view>
  </view>
</template>

<script>
import './index.less'
import editIcon from '@/images/edit.png'
import { setTitle } from '@/utils'

export default {
  components: {},
  data() {
    return {
      editIcon,
      addressList: [
        {
          name: '问题反馈',
          phone: '182883883',
          address: '北京市海淀区恒大新宏福苑西区20号楼2单元301',
        },
        {
          name: '问题反馈',
          phone: '182883883',
          address: '北京市海淀区恒大新宏福苑西区20号楼2单元301',
        },
        {
          name: '问题反馈',
          phone: '182883883',
          address: '北京市海淀区恒大新宏福苑西区20号楼2单元301',
        },
      ],
    }
  },
  computed: {},
  mounted() {
    setTitle({ title: '收货地址' })
  },
  methods: {
    add() {},
  },
}
</script>
