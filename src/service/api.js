import http from './http'
// import fake from './fake'

const requestAddressList = [
  {
    describe: '获取主题色',
    method: 'getDetail',
    url: '/portal/config/getSkin',
    type: 'post',
  },
  {
    describe: '获取微信授权的token', // 这个token是微信要用的，具体怎么使用需要看看微信
    method: 'getToken',
    url: '/api/applet/getToken.ns',
    type: 'post',
  },
  {
    describe: '获取分类',
    method: 'getCategory',
    url: '/api/banner/product.ns',
    type: 'post',
  },
  {
    describe: '获取指定分类下品项列表',
    method: 'getProductByCategory',
    url: '/api/product/loadProductByClassCode.ns',
    type: 'post',
  },
  {
    describe: '获取指定分类下品项列表',
    method: 'getSellGoods',
    url: '/api/product/findSellGoods.ns',
    type: 'post',
  },
  {
    describe: '获取产品详情',
    method: 'getProductDetail',
    url: '/api/product/findGoodsInfo.ns',
    type: 'post',
  },
  {
    describe: '充值记录',
    method: 'rechargeRecord',
    url: '/api/bill/rechargeRecord.ns',
    type: 'post',
  },
  {
    describe: '添加到购物车',
    method: 'addToShopcar',
    url: '/api/shopcar/addToShopcar.ns',
    type: 'post',
  },
  {
    describe: '搜索商品',
    method: 'searchProduct',
    url: '/api/product/searchProduct.ns',
    type: 'post',
  },
  {
    describe: '获取购物车列表',
    method: 'getShopcarList',
    url: '/api/shopcar/showShopCar.ns',
    type: 'post',
  },
  {
    describe: '充值记录',
    method: 'rechargeRecord',
    url: '/api/bill/rechargeRecord.ns',
    type: 'post',
  },
  {
    describe: '消费记录',
    method: 'consumptionRecord',
    url: '/api/bill/consumptionRecord.ns',
    type: 'post',
  },
  {
    describe: '获取余额',
    method: 'getBillCost',
    url: '/api/bill/balance.ns	',
    type: 'post',
  },
  {
    describe: '获取当前用户信息',
    method: 'getUserInfo',
    url: '/api/customer/userInfo.ns	',
    type: 'post',
  },
  {
    describe: '获取所有订单列表',
    method: 'getAllOrder',
    url: '/api/order/listAllOrder.ns',
    type: 'post',
  },
  {
    describe: '获取待付款列表',
    method: 'getPendingPayment',
    url: '/api/order/pendingPayment.ns',
    type: 'post',
  },
  {
    describe: '获取当天收货列表',
    method: 'getWaitDelivery',
    url: '/api/v2/delivery/todayDeliveryOrder.ns',
    type: 'post',
  },
  {
    describe: '获取已完成列表',
    method: 'getAlreadyCompleted',
    url: '/api/order/alreadyCompleted.ns',
    type: 'post',
  },
  {
    describe: '获取电子对账单',
    method: 'getBillList',
    url: '/api/v3/delivery/monthOrder.ns',
    type: 'post',
  },
  {
    describe: '获取客诉列表',
    method: 'getComplainList',
    url: '/api/complain/loadComplainByUserId.ns',
    type: 'post',
  },
  {
    describe: '获取质检报告',
    method: 'getQualityReport',
    url: '/api/customer/report.ns	',
    type: 'post',
  },
  {
    describe: '获取客诉品项列表',
    method: 'getComplaintProductList',
    url: '/api/product/complaintProductList.ns',
    type: 'post',
  },
  {
    describe: '获取客诉品项详情',
    method: 'getComplaintDetail',
    url: '/api/complain/loadComplainByCode.ns',
    type: 'post',
  },
  {
    describe: '充值',
    method: 'recharge',
    url: '/api/bill/recharge.ns',
    type: 'post',
  },
  {
    describe: '获取客诉问题类型',
    method: 'getComplainType',
    url: '/api/v2/complain/complainType.ns',
    type: 'post',
  },
  {
    describe: '提交客诉',
    method: 'submitComplain',
    url: '/api/complain/submit.ns',
    type: 'post',
  },
  {
    describe: '修改门店收货码',
    method: 'updateRecieveCode',
    url: '/api/customer/updateRecieveCode.ns',
    type: 'post',
  },
  {
    describe: '修改门店收货码',
    method: 'updateRecieveCode',
    url: '/api/customer/updateRecieveCode.ns',
    type: 'post',
  },
  {
    describe: '获取当前用户绑定门店列表',
    method: 'getBindShopList',
    url: '/api/applet/bindList.ns',
    type: 'post',
  },
  {
    describe: '使用门店',
    method: 'useShop',
    url: '/api/applet/useCustomer.ns',
    type: 'post',
  },
  {
    describe: '绑定门店',
    method: 'bindShop',
    url: '/api/applet/bind.ns',
    type: 'post',
  },
  {
    describe: '解绑门店',
    method: 'unbindShop',
    url: '/api/applet/unbind.ns',
    type: 'post',
  },
  {
    describe: '解绑门店',
    method: 'getOpenId',
    url: '/api/applet/getOpenId.ns',
    type: 'get',
  },
  {
    describe: '创建订单',
    method: 'createOrder',
    url: '/api/order/createOrder.ns',
    type: 'post',
  },
  {
    describe: '批量下单',
    method: 'submitBatchOrder',
    url: '/api/order/submitBatchOrder.ns',
    type: 'post',
  },
  {
    describe: '产品可选的配送时间',
    method: 'dateChooser',
    url: '/api/product/dateChooser.ns',
    type: 'post',
  },
  {
    describe: '从购物车结算',
    method: 'paySettlement',
    url: '/api/v2/order/paySettlement.ns',
    type: 'post',
  },
  {
    describe: '余额支付',
    method: 'balancePayment',
    url: '/api/order/balancePayment.ns',
    type: 'post',
  },
  {
    describe: '支付订单',
    method: 'orderPay',
    url: '/api/order/orderPay.ns',
    type: 'post',
  },
  {
    describe: '取消订单',
    method: 'deleteOrder',
    url: '/api/order/deleteOrder.ns',
    type: 'post',
  },
  {
    describe: '订单详情列表',
    method: 'getOrderDetail',
    url: '/api/order/appletListOrderDetail.ns',
    type: 'post',
  },
  {
    describe: '已完成订单详情',
    method: 'getCompleteOrderDetail',
    url: '/api/order/listCompleteOrderDetail.ns',
    type: 'post',
  },
  {
    describe: '首页接口',
    method: 'getHomeData',
    url: '/api/applet/home.ns',
    type: 'post',
  },
  {
    describe: '确认收货',
    method: 'confirmReceipt',
    url: '/api/order/confirmReceipt.ns?latitude=1&longitude=1',
    type: 'post',
  },
]

const API = {}

requestAddressList.forEach(item => {
  // if (API[item.method]) console.log(`存在相同方法：${item.method}`)

  API[item.method] = (requestParams = {}, requestOptions) => {
    let url
    if (requestParams?.urlParam) {
      // url中传参数
      url = `${item.url}/${requestParams.urlParam}`
      delete requestParams.urlParam
    }

    return http[item.type](url || item.url, requestParams, requestOptions)
  }
})

export default API
