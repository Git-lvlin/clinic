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
    shop_list: [], // 大于0时是店主
    currentShop: '',
    role: 0, //0用户 1店主 2店员 3仓库,
    menus: {
      "water_ticket": {
        "name": "充值中心",
        "url": "pages\/user\/recharge\/index",
        "icon_uri": "https:\/\/dev.quantianxia.xin\/assets\/api\/icon\/youhuiquan.png",
        "icon": "youhuiquan"
      },
      "cash-pledge": {
        "name": "押金管理",
        "url": "pages\/user\/cash-pledge\/index",
        "icon_uri": "https:\/\/dev.quantianxia.xin\/assets\/api\/icon\/youhuiquan.png",
        "icon": "youhuiquan"
      },
      "sharing_order": {
        "name": "拼团订单",
        "url": "pages\/sharing\/order\/index",
        "icon_uri": "https:\/\/test.shop.kjcms.cn\/assets\/api\/icon\/pintuan.png",
        "icon": "pintuan"
      },
      "dealer": {
        "name": "分销中心",
        "url": "pages\/dealer\/index\/index",
        "icon_uri": "https:\/\/dev.quantianxia.xin\/assets\/api\/icon\/fenxiaozhongxin.png",
        "icon": "fenxiaozhongxin"
      },
      "help": {
        "name": "我的帮助",
        "url": "pages/user/help/index",
        "icon_uri": "https://dev.quantianxia.xin/assets/api/icon/help.png",
        "icon": "help"
      }
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //var titleTextColor = wx.getStorageSync('titleTextColor')
    //var titleBackgroundColor = wx.getStorageSync('titleBackgroundColor')

    // if (titleTextColor && titleBackgroundColor) {
    //   // 设置navbar标题、颜色
    //   wx.setNavigationBarColor({
    //     frontColor: titleTextColor,
    //     backgroundColor: titleBackgroundColor
    //   })
    // }

    let _this = this;
    _this.setData({
      userHeaderBGC: '#0ca64f'
    });

    // 获取当前用户信息
    _this.getUserDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

    // 更新购物车角标
    App.setCartTabBadge()

    this.setData({
      isLogin: App.checkIsLogin()
    })

    // if (typeof this.getTabBar === 'function' &&
    //   this.getTabBar()) {
    //   this.getTabBar().setData({
    //     selected: 3
    //   })
    // }
  },

  /**
   * 获取当前用户信息
   */
  getUserDetail() {
    let _this = this;
    App._get('user.index/detail', {}, function (result) {
      /*
      result.data = {
        menus: {},
        orderCount: {},
        setting: {},
        shop_list: [],
        userInfo: {},
        warehouse_list: [],
        storeUserInfo: {}
      }
      */

      let {
        shop_list,
        warehouse_list,
        storeUserInfo
      } = result.data;

      
      if(shop_list.length) {
        App.globalData.shop_id = shop_list[0].shop_id;
        App.globalData.role = shop_list[0].clerk_role.value; //value = 1 或者 2 

        _this.setData({
          currentShop: shop_list[0].shop_name + " (管理员)",
          shop_list
        }) 
      }

      // let role = 0;
      // if (shop_list.length) {
      //   role = shop_list[0].clerk_role.value; // value = 1 或者 2 
      // } else if (warehouse_list.length) {
      //   role = 3;
      // } else if(storeUserInfo) {
      //   role = 4;
      // }

      /* role
      0 用户
      1 店主
      2 店员
      3 仓库
      4 业务员*/
      /*if (role == 0) { // 不显示仓库和水店入口
        delete result.data.menus.shopkeeper_order
        delete result.data.menus.storehouse_order
        delete result.data.menus.task_center
        delete result.data.menus.verify_location;
      } else if (role == 1) { // 不显示优惠券和我的优惠券
        delete result.data.menus.coupon;
        delete result.data.menus.my_coupon;
        delete result.data.menus.water_ticket;
        delete result.data.menus.task_center
        delete result.data.menus['cash-pledge'];
        delete result.data.menus.sharing_order;
        delete result.data.menus.dealer;
        delete result.data.menus.verify_location;
        
        App.globalData.shop_id = shop_list[0].shop_id;
        _this.setData({
          currentShop: shop_list[0].shop_name + " (管理员)",
          shop_list
        })
      } else if (role == 2) {// 不显示收货地址、优惠券、我的优惠券
        delete result.data.menus.address;
        delete result.data.menus.coupon;
        delete result.data.menus.my_coupon;
        delete result.data.menus.water_ticket;
        delete result.data.menus.task_center
        delete result.data.menus['cash-pledge'];
        delete result.data.menus.sharing_order;
        delete result.data.menus.dealer;
        delete result.data.menus.verify_location;
        App.globalData.shop_id = shop_list[0].shop_id;
        _this.setData({
          currentShop: shop_list[0].shop_name + " (店员)",
          shop_list
        })
      } else if (role == 3) {// 不显示收货地址、优惠券、我的优惠券，店主入口
        delete result.data.menus.shopkeeper_order;
        delete result.data.menus.sharing_order;
        delete result.data.menus.dealer;
        delete result.data.menus.water_ticket;
        delete result.data.menus.storehouse_order;
        delete result.data.menus.coupon;
        delete result.data.menus.address;
        delete result.data.menus.my_coupon;
        delete result.data.menus.task_center;
        delete result.data.menus.verify_location;
        delete result.data.menus['cash-pledge'];
      } else if(role == 4) {
        delete result.data.menus.shopkeeper_order;
        delete result.data.menus.sharing_order;
        delete result.data.menus.dealer;
        delete result.data.menus.water_ticket;
        delete result.data.menus.storehouse_order;
        delete result.data.menus.coupon;
        delete result.data.menus.address;
        delete result.data.menus.my_coupon;
        delete result.data.menus['cash-pledge'];
      }*/

      _this.setData(result.data);
      // _this.setData({
      //   role,
      //   shop_list,
      // });

      //App.globalData.role = role;
      _this.saveUserRole();
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

      withDraw: '/pages/shopkeeper/dealer/withdraw/apply/apply',
      saleOrder: '/pages/shopkeeper/sale-orders/index',
      purchaseOrder: '/pages/shopkeeper/purchaseOrder/index',
      bill: '/pages/shopkeeper/bill/index',
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

  // 保存用户角色
  saveUserRole() {
    let _this = this;
    wx.setStorageSync('role', _this.data.role)
  },

  /**
   * 跳转到登录页
   */
  onLogin() {
    App.doLogin();
  },

  /**
   * 用户登出
   */
  onLogout() {
    this.setData({
      currentShop: '',
      shop_list: [],
      role: '0'
    })
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
  }
})