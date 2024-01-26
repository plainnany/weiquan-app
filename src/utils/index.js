import Taro from '@tarojs/taro'

export function setTitle(params) {
  Taro.setNavigationBarTitle(params)
}

// 获取系统信息
export function getSystemInfoSync() {
  const { windowWith, windowHeight } = wx.getSystemInfoSync()

  return { windowWith, windowHeight }
}

const stringify = obj =>
  Object.keys(obj)
    .filter(v => obj[v])
    .map(v => `${v}=${obj[v]}`)
    .join('&')

const parse = s => {
  const string = s.split('?')[1]
  const obj = {}
  string.split('&').forEach(item => {
    const [key, value] = item.split('=')
    if (value && value !== 'undefined') {
      obj[key] = value
    }
  })
  return obj
}

export const qs = {
  stringify,
  parse,
}
