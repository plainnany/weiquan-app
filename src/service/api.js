import http from './http'
// import fake from './fake'

const requestAddressList = [
  {
    describe: '获取主题色',
    method: 'getDetail',
    url: '/portal/config/getSkin',
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

API.getCategory = () =>
  Promise.resolve({
    data: [
      {
        name: '牛乳',
        list: [
          {
            id: 'p111',
            imgUrl: '',
            price: '12.8',
            number: '1',
            specifications: '950g',
            title: '400ml 乳酸菌原味瓶装',
            unit: '1箱',
          },
        ],
      },
      {
        name: '苹果',
        list: [],
      },
    ],
  })

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
