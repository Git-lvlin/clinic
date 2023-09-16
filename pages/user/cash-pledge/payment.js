// pages/user/cash-pledge/payment.js
import PayTypeEnum from '../../../utils/enum/order/PayType'
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    shopName: '请选择门店',
    showPayPopup: false,
    PayTypeEnum, // 支付方式
    defaultSum: 120
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      shopName: App.globalData.shopInfo.shop_name
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  bindbuttontap({item, index}) {
    this.setData({
      showDialog: false
    })
  },

  showDialog(){
    this.setData({
      showDialog: true
    })
  },

  // 预支付 然后调起支付

  toPrepay(pay_type) {
   let _this = this;
    if(!App.globalData.shopInfo.shop_id) {
      App.showError('请先选择订水门店')
      return
    };
    App._post_form(
      'user.Deposit/submit?wxapp_id='+App.getWxappId(),
    {
      token: wx.getStorageSync('token'),
      deposit_type: 10,
      money: _this.data.defaultSum,
      pay_type,
      shop_id: App.globalData.shopInfo.shop_id,
      wxapp_id: App.getWxappId()
    },

    function(res) {
      if(pay_type === 10) {
        App.showSuccess('支付成功', function(){
          wx.navigateBack()
        })
        return;
      }
    
      App.wxPayment({
        payment: res.data.payment, 
        success: function(res) {
          App.showSuccess('支付成功', function(){
            wx.navigateBack()
          })
        }
      })
    },
    function(err) {
      App.showError('出错了，重试一次吧')
    })
  },

  /**
   * 显示/隐藏支付方式弹窗
   */
  onTogglePayPopup() {
    this.setData({
      showPayPopup: !this.data.showPayPopup
    });
  },

  /**
   * 选择支付方式
   */
  onSelectPayType(e) {
    let _this = this;
    // 隐藏支付方式弹窗
    _this.onTogglePayPopup();
    if (!_this.data.showPayPopup) {
      // 发起付款请求
      _this.toPrepay(e.currentTarget.dataset.value, _this.data.defaultSum);
    }
  },

  /* */
  handleSumInput(e) {
    if(isNaN(e.detail.value)) {
      App.showError('输入的金额无效')
      return;
    }
    this.setData({
      defaultSum: Number(e.detail.value)
    })
  },
})