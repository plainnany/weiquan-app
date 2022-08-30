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
    describe: '获取待发货列表',
    method: 'getWaitDelivery',
    url: '/api/order/waitDelivery.ns',
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
    url: '/api/bill/x.ns',
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

API.getDetail = () =>
  Promise.resolve({
    message: '这是一个接口返回的字符串',
  })

API.getProduct = () =>
  Promise.resolve({
    data: [
      {
        id: 'p111',
        imgUrl: '',
        price: '450',
        number: '12',
        specifications: '950g',
        title: '400ml 乳酸菌原味瓶装',
        unit: '1箱',
      },
      {
        imgUrl: '',
        price: '450',
        number: '12',
        specifications: '950g',
        title: '400ml 乳酸菌原味瓶装',
        unit: '1箱',
      },
      {
        imgUrl: '',
        price: '12',
        number: '1',
        specifications: '950g',
        title: '400ml 乳酸菌原味瓶装',
        unit: '1箱',
      },
      {
        imgUrl: '',
        price: '12',
        number: '1',
        specifications: '950g',
        title: '400ml 乳酸菌原味瓶装',
        unit: '1箱',
      },
      {
        imgUrl: '',
        price: '12',
        number: '1',
        specifications: '950g',
        title: '400ml 乳酸菌原味瓶装',
        unit: '1箱',
      },
      {
        imgUrl: '',
        price: '12',
        number: '1',
        specifications: '950g',
        title: '400ml 乳酸菌原味瓶装',
        unit: '1箱',
      },
    ],
  })

// API.getCategory = () =>
//   Promise.resolve({
//     data: [
//       {
//         name: '牛乳',
//         list: [
//           {
//             id: 'p111',
//             imgUrl: '',
//             price: '12.8',
//             number: '1',
//             specifications: '950g',
//             title: '400ml 乳酸菌原味瓶装',
//             unit: '1箱',
//           },
//         ],
//       },
//       {
//         name: '苹果',
//         list: [],
//       },
//     ],
//   })

API.getOrder = () =>
  Promise.resolve({
    data: [
      {
        orderNumber: '222049485859583929',
        type: 'to-pay',
        date: '2022年2月4号',
        total: '2',
        sum: '76.6',
        productList: [
          {
            id: 1,
            imageUrl: '',
            price: '12.8',
            number: '78',
            specifications: '950g',
            title: '400ml 乳酸菌原味瓶装',
            unit: '1箱',
            type: '正常单',
          },
        ],
      },
      {
        orderNumber: '222049485859ss583929',
        type: 'to-deliver',
        date: '2022年2月4号',
        total: '2',
        sum: '76.6',
        productList: [
          {
            id: 2,
            imageUrl: '',
            price: '12.8',
            number: '78',
            specifications: '950g',
            title: '400ml 乳酸菌原味瓶装',
            unit: '1箱',
            type: '正常单',
          },
          {
            id: 4,
            imageUrl: '',
            price: '12.8',
            number: '78',
            specifications: '950g',
            title: '400ml 乳酸菌原味瓶装',
            unit: '1箱',
            type: '正常单',
          },
          {
            id: 3,
            imageUrl: '',
            price: '12.8',
            number: '78',
            specifications: '950g',
            title: '400ml 乳酸菌原味瓶装',
            unit: '1箱',
            type: '正常单',
          },
        ],
      },
    ],
  })

export default API
