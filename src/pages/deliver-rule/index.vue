<template>
  <view class="deliver-rule">
    <view class="deliver-title">
      <view>
        极 速 配 送
      </view>
      <view>
        美味不停留
      </view>
    </view>
    <view class="deliver-card" v-for="(item, index) in rules" :key="index">
      <view class="deliver-item">
        <view class="deliver-item-text">产品名称</view>
        <view class="deliver-item-name">{{ item.productName }}</view>
      </view>
      <view class="deliver-item">
        <view class="deliver-item-text">产品规格</view>
        <view class="deliver-item-name">{{ item.rule }}</view>
      </view>
      <view class="deliver-item">
        <view class="deliver-item-text">配送规则</view>
        <view class="deliver-item-name">{{ item.deliverRule }}</view>
      </view>
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
      rules: [
        {
          productName: '950ml 味全高品质冷藏牛乳（瓶装外食）',
          rule: '950ml',
          deliverRule: '周一下单 ，周二交货',
        },
        {
          productName: '950ml 味全高品质冷藏牛乳（瓶装外食）',
          rule: '950ml',
          deliverRule: '周一下单 ，周二交货',
        },
        {
          productName: '950ml 味全高品质冷藏牛乳（瓶装外食）',
          rule: '950ml',
          deliverRule: '周一下单 ，周二交货',
        },
      ],
    }
  },
  computed: {},
  mounted() {
    setTitle({ title: '配送规则' })
  },
  methods: {
    add() {},
  },
}
</script>
