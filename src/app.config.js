export default defineAppConfig({
  pages: [
    'pages/index/index', // 首页
    'pages/product/index', // 分类
    'pages/shop/index', // 购物车
    'pages/user/index', // 用户中心
    'pages/user/help', // 帮助中心
    'pages/search/index', // 搜索
    'pages/cost/index', // 余额
    'pages/cost/detail', // 余额明细
    'pages/charge/index', // 充值
    'pages/electronic-bill/index', // 电子对账单
    // 'pages/change-account/index', // 切换用户
    'pages/user-info/index', // 用户信息
    'pages/setting/index', // 切换用户
    'pages/deliver-rule/index', // 配送规则
    'pages/product-detail/index', // 产品详情
    'pages/order/index', // 订单
    'pages/order-detail/index', // 我的订单
    'pages/confirm-order/index', // 订单确认
    'pages/order-settle/index', // 订单结算
    'pages/comment/index', // 问题反馈
    'pages/web-view/index', // 内嵌h5页面
    'pages/bind-account/index', // 绑定账户
    'pages/bind-account/forget', // 忘记密码
    'pages/custom-comment/index', // 客诉列表
    'pages/quality-report/index', // 质检报告
    'pages/change-receive-code/index', // 修改门店收货码
    'pages/change-password/index', // 修改登录密码
    'pages/account-manage/index', // 账户管理
    'pages/account-modify/index', // 账户修改
    'pages/notice/index', // 消息中心
    'pages/notice/detail', // 消息详情
    'pages/order-notice/index', // 下单提醒
    'pages/order-notice/edit', // 编辑下单提醒
    'pages/query/index', // 查询&修改
    'pages/image-preview/index', // 收退货单
    'pages/invoice/index', // 开票申请
    'pages/pay-countdown/index', // 微信支付倒计时
    'pages/pay-countdown/result', // 支付结果页面
    'pages/confirm-order/date-chooser', // 选择日期
  ],
  tabBar: {
    color: '#666666',
    selectedColor: '#fc461e',
    list: [
      {
        pagePath: 'pages/index/index',
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
