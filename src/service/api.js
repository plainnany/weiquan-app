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

export default API
