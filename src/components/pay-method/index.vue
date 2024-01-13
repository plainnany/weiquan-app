<template>
  <view class="pay-method">
    <radio-group @change="onPayMethodChange">
      <label class="pay-method-item flex-between-center" v-for="payItem in payList" :key="payItem.name">
        <view class="flex-between-center">
          <view>
            <image :src="payItem.icon" mode="" />
          </view>
          <view>
            {{ payItem.name }}
            <text v-if="payItem.method === 'weixin-pocket'"> ({{ userInfo.accoutBalance }}) </text>
          </view>
        </view>
        <view>
          <radio :value="payItem.method" :checked="payItem.method === payMethod" color="#333" v-show="payItem.method === payMethod" />
        </view>
      </label>
    </radio-group>

    <Modal :visible="visible" title="提示" cancelText="取消" confirmText="确定" @cancel="onCancel" @confirm="onConfirm">
      <view class="modal-content">确认是否使用总部余额支付，该订单退款相应退到总部余额</view>
    </Modal>
  </view>
</template>

<script>
import './index.less'
import wechatIcon from '@/images/wechat.png'
import weipocketIcon from '@/images/wei-pocket.png'
import Modal from '@/pages/setting/modal.vue'

export default {
  props: {
    showTipModal: Boolean,
  },
  components: {
    Modal,
  },
  watch: {
    showTipModal(val) {
      this.visible = val
    },
  },
  data() {
    return {
      payMethod: 'weixin-pocket',
      visible: false,
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    payList() {
      if (this.userInfo.accountType === '02' || !this.userInfo.dianZhang) {
        return [
          {
            method: 'weixin-2',
            name: '微信好友支付',
            icon: wechatIcon,
          },
        ]
      }
      return [
        {
          method: 'weixin-pocket',
          name: '余额支付',
          icon: weipocketIcon,
        },
        {
          method: 'company-pocket',
          name: '总部余额',
          icon: weipocketIcon,
        },
        {
          method: 'weixin',
          name: '微信支付',
          icon: wechatIcon,
        },
        {
          method: 'weixin-2',
          name: '微信好友支付',
          icon: wechatIcon,
        },
      ]
    },
  },
  created() {},
  mounted() {},
  methods: {
    onCancel() {
      this.visible = false
      this.$emit('cancel')
    },
    onConfirm() {
      this.visible = false
      this.$emit('confirm')
    },
    onPayMethodChange(e) {
      this.payMethod = e.detail.value
      this.$emit('change', e)
    },
  },
}
</script>
