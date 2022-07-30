import Taro from '@tarojs/taro'

class HttpRequest {
  constructor() {}

  get(requestUrl, requestParams, requestOptions = {}) {
    return this.Request(requestUrl, 'get', requestParams, requestOptions)
  }

  post(requestUrl, requestParams, requestOptions = {}) {
    return this.Request(requestUrl, 'post', requestParams, requestOptions)
  }

  Request(requestUrl, method = 'get', requestParams = {}, requestOptions) {
    if (!requestUrl && !requestParams.requestFileUrl) {
      throw new Error('请填写URl!')
    }
    const { requestHeaders = {} } = requestOptions

    let data = null

    if (method === 'get') {
      data = {
        ...requestParams,
        timer: new Date(),
      }
    } else if (method === 'post') data = requestParams

    return new Promise((resolve, reject) => {
      Taro.showLoading()

      Taro.request({
        method: method.toUpperCase(),
        url: requestParams.requestFileUrl || requestUrl,
        data,
        header: {
          'Content-Type': 'application/json',
          ...requestHeaders,
        },
      })
        .then(
          response => {
            resolve(this.transformResponse(response))
          },
          err => {
            reject(err)
          }
        )
        .finally(() => {
          Taro.hideLoading()
        })
    })
  }

  // 响应数据处理
  transformResponse(response) {
    let res = response.data
    return res
  }
}

export default new HttpRequest()
