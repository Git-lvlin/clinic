// pages/user/cash-pledge/reback-pledge.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accounts: ['微信', '支付宝'],
    accountIndex: 0,
    selectedShopId: '',
    shopName: '请选择门店',
    formData: {
      deposit_id: 0,
      shop_id: 0,
      refund_type: 10,
      alipay_name: '',
      alipay_account: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'formData.deposit_id': options.param
    })
    this.getShopList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      shopName: App.globalData.shopInfo.shop_name,
      'formData.shop_id': App.globalData.shopInfo.shop_id
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取门店列表
   */
  getShopList() {
    let _this = this;
    _this.setData({
      isLoading: true
    });
    App._get('shop/lists', {
      longitude: App.globalData.coordinate.longitude || 23.020893,
      latitude: App.globalData.coordinate.latitude || 113.751884,
    }, (result) => {
      _this.setData({
        shopList: result.data.list,
        isLoading: false
      });
    });
  },

  /*
   * 退桶申请
   */
  toApplyReturnCanBucket() {
    let _this = this;
    let url = 'user.Deposit/refundApply';
    url += '?wxapp_id=' + App.getWxappId();
    url += '&token=' + wx.getStorageSync('token')
    App._post_form(
      url,
      _this.data.formData,
      function (res) {
        App.showSuccess('申请成功', function () {
          wx.navigateBack({
            delta: 1,
          })
        })
      }
    )
  },

  /*账户类型改变 */
  handleAccountChange(e) {
    
    switch (e.detail.value) {
      case '1':
        this.setData({
          'formData.refund_type': 20
        })
        break;

      case '0':
        this.setData({
          'formData.refund_type': 10
        })
        break
    }
  },

  /* 获取支付宝账户名 */
  handleAccountInput(e) {
      this.setData({
        'formData.alipay_name': e.detail.value
      })
  },

 /* 获取支付宝账户号码 */
  handleAccountNumberInput(e) {
    this.setData({
      'formData.alipay_account': e.detail.value
    })
  }
})