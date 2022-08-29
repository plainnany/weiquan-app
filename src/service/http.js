import Taro from '@tarojs/taro'
import { BASE_URL } from '@/const'

const tempToken = ''

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
      const token = Taro.getStorageSync('token') || tempToken

      Taro.request({
        method: method.toUpperCase(),
        // url: requestParams.requestFileUrl || requestUrl,
        url: `${BASE_URL}${requestUrl}`,
        data,
        header: {
          'content-type': method === 'get' ? 'application/json' : 'application/x-www-form-urlencoded',
          token,
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
    if (res.returnCode === 200) {
      return res.data
    }

    return Promise.reject(res)
  }
}

export default new HttpRequest()
