import Taro from '@tarojs/taro'
import { BASE_URL } from '@/const'
import store from '@/store'

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
    const { requestHeaders = {}, needLoading = true } = requestOptions

    let data = null

    if (method === 'get') {
      data = {
        ...requestParams,
        timer: new Date(),
      }
    } else if (method === 'post') data = requestParams

    return new Promise((resolve, reject) => {
      if (needLoading) {
        Taro.showLoading({
          title: '加载中',
        })
      }

      const token = Taro.getStorageSync('token')

      Taro.request({
        method: method.toUpperCase(),
        // url: requestParams.requestFileUrl || requestUrl,
        url: `${BASE_URL}${requestUrl}`,
        data,
        header: {
          'content-type': method === 'get' ? 'application/json' : 'application/x-www-form-urlencoded',
          token,
          platform: '3', // 固定参数
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
    } else if (res.returnCode === 401) {
      // 此处不太好使用弹窗绑定账号，可以给绑定账号单独做个页面，跳转过去
      // 跳转用户绑定页面只跳转一次
      Taro.showToast({
        title: '用户未登录，请先绑定用户',
        icon: 'none',
        success() {
          setTimeout(() => {
            if (!store.state.bindStatus) {
              Taro.navigateTo({ url: '/pages/bind-account/index' })
            }
            store.commit('setBindStatus', true)
          }, 1000)
        },
      })
    }

    return Promise.reject(res)
  }
}

export default new HttpRequest()
