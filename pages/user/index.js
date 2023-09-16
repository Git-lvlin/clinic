const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo: {}, // 用户信息
    orderCount: {}, // 订单数量
    userHeaderBGC: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var titleTextColor = wx.getStorageSync('titleTextColor')
    var titleBackgroundColor = wx.getStorageSync('titleBackgroundColor')
    if (titleTextColor && titleBackgroundColor) {
      // 设置navbar标题、颜色
      wx.setNavigationBarColor({
        frontColor: titleTextColor,
        backgroundColor: titleBackgroundColor
      })
    }
    this.setData({
      userHeaderBGC: titleBackgroundColor
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    // 获取当前用户信息
    _this.getUserDetail();
    // 更新购物车角标
    App.setCartTabBadge()
  },

  /**
   * 获取当前用户信息
   */
  getUserDetail() {
    let _this = this;
    App._get('user.index/detail', {}, function (result) {
      _this.setData(result.data);
    });
  },

  /**
   * 订单导航跳转
   */
  onTargetOrder(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    let urls = {
      all: '/pages/order/index?type=all',
      payment: '/pages/order/index?type=payment',
      received: '/pages/order/index?type=received',
      refund: '/pages/order/refund/index',
    };
    // 转跳指定的页面
    wx.navigateTo({
      url: urls[e.currentTarget.dataset.type]
    })
  },

  /**
   * 菜单列表导航跳转
   */
  onTargetMenus(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    wx.navigateTo({
      url: '/' + e.currentTarget.dataset.url
    })
  },

  /**
   * 跳转我的钱包页面
   */
  onTargetWallet(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    wx.navigateTo({
      url: './wallet/index'
    })
  },

  /**
   * 跳转积分明细页
   */
  onTargetPoints(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    wx.navigateTo({
      url: '../points/log/index'
    });
  },

  /**
   * 跳转分销页
   */
  onTargetTroupe(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    wx.navigateTo({
      url: '../troupe/index/index'
    });
  },

  onTargetDealer(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    wx.navigateTo({
      url: '../dealer/index/index'
    });
  },

  // 跳转到我的优惠券
  onTargetMyCoupon(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    wx.navigateTo({
      url: './coupon/coupon'
    });
  },

  // 跳转到拼团订单
  onTargetMyPintuan(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    wx.navigateTo({
      url: '../sharing/order/index'
    });
  },

  /**
   * 跳转到登录页
   */
  onLogin() {
    // wx.navigateTo({
    //   url: '../login/login',
    // });
    App.doLogin();
  },

  /**
   * 用户登出
   */
  onLogout() {
    App.doLogout();
  },

  /**
   * 验证是否已登录
   */
  onCheckLogin() {
    let _this = this;
    if (!_this.data.isLogin) {
      App.showError('很抱歉，您还没有登录');
      return false;
    }
    return true;
  },

  /**
   * 授权登录
   */
  getUserInfo(e) {
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '获取用户相关信息',
      success(result) {
        console.log('用户同意了授权')
        // console.log('result: ', result)
        App.getUserInfo(result, () => {
          // App.showError('更新成功');
        });
      },
      fail(e) {
        console.log('用户拒绝了授权 ', e)
      }
    })
  },
})
