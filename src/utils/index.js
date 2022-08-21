import Taro from '@tarojs/taro'

export function setTitle(params) {
  Taro.setNavigationBarTitle(params)
}

// 获取系统信息
export function getSystemInfoSync() {
  const { windowWith, windowHeight } = wx.getSystemInfoSync()

  return { windowWith, windowHeight }
}
