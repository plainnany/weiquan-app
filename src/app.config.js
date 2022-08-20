export default defineAppConfig({
  pages: [
    'pages/electronic-bill/index', // 电子对账单
    // 'pages/index/index',
    'pages/product/index', // 产品详情
    'pages/shop/index', // 购物车
    'pages/user/index', // 用户中心
    'pages/search/index', // 搜索
    'pages/cost/index', // 余额
    'pages/charge/index', // 充值
  ],
  tabBar: {
    color: '#666666',
    selectedColor: '#FA4A2D',
    list: [
      {
        pagePath: 'pages/electronic-bill/index',
        text: '首页',
        iconPath: './images/tab/home.png',
        selectedIconPath: './images/tab/home-active.png',
      },
      {
        pagePath: 'pages/product/index',
        text: '分类',
        iconPath: './images/tab/category.png',
        selectedIconPath: './images/tab/category-active.png',
      },
      {
        pagePath: 'pages/shop/index',
        text: '购物车',
        iconPath: './images/tab/shop.png',
        selectedIconPath: './images/tab/shop-active.png',
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: './images/tab/my.png',
        selectedIconPath: './images/tab/my-active.png',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
})
