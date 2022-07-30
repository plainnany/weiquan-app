export default defineAppConfig({
  pages: ['pages/index/index', 'pages/product/index', 'pages/shop/index', 'pages/user/index'],
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './images/tab/home.png',
        selectedIconPath: './images/tab/home-active.png',
      },
      {
        pagePath: 'pages/product/index',
        text: '产品',
        iconPath: './images/tab/cart.png',
        selectedIconPath: './images/tab/cart-active.png',
      },
      {
        pagePath: 'pages/shop/index',
        text: '购物车',
        iconPath: './images/tab/brand.png',
        selectedIconPath: './images/tab/brand-active.png',
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: './images/tab/user.png',
        selectedIconPath: './images/tab/user-active.png',
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
