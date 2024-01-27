<template>
  <view class="pay-method">
    <radio-group @change="onPayMethodChange">
      <label class="pay-method-item" v-for="payItem in payList" :key="payItem.name">
        <view v-if="payItem.method === 'weixin-2'">
          <button open-type="share">
            <image :src="payItem.icon" mode="" />
            {{ payItem.name }}
          </button>
        </view>
        <view v-else class="pay-method-info">
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
    initPayMethod: String,
  },
  components: {
    Modal,
  },
  watch: {
    showTipModal(val) {
      this.visible = val
    },
    initPayMethod: {
      immediate: true,
      handler(val) {
        this.payMethod = val
      },
    },
  },
  data() {
    return {
      payMethod: '',
      visible: false,
      wechatIcon,
    }
  },
  // 作为组件，open-type share的情况下onShareAppMessage方法必须要写到pages顶级页面去，写到组件里面不生效
  // onShareAppMessage() {
  //   return {
  //     title: '老板，订货请支付！',
  //     path: `/pages/web-view/index?url=${this.wechatUrl}`,
  //     imageUrl: 'http://foodservice-main.oss-cn-hangzhou.aliyuncs.com/kd/fx.png',
  //     // promise,
  //   }
  // },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    payList() {
      if (this.userInfo.accountType === '02' || !this.userInfo.dianZhang) {
        return [
          {
            method: 'weixin-2',
            name: '微信好友代付',
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
        ...(this.userInfo.showParentPay
          ? [
              {
                method: 'company-pocket',
                name: '总部余额',
                icon: weipocketIcon,
              },
            ]
          : []),
        {
          method: 'weixin',
          name: '微信支付',
          icon: wechatIcon,
        },
        {
          method: 'weixin-2',
          name: '微信好友代付',
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
