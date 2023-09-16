// pages/shopkeeper/index.js
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: 2,
    shop: {
      extend: {
        money: "0.00",
        total_withdraw: "0.00",
        order_total: 0
      }
    }
  },

  readyToWithdraw() {
    if(this.data.shop.extend.money < 1) {
      App.showError('额度太少，至少1元起提');
      return;
    }
    wx.navigateTo({
      url: '/pages/shopkeeper/dealer/withdraw/apply/apply',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({role: App.globalData.role})
    // 获取店铺中心数据
    if(App.globalData.role == 1) {
      _this.getCenter();
    }
  },

  /**
   * 获取店铺中心数据
   */
  getCenter() {
    let _this = this;
    App._get('shop/center', {}, function(result) {
      let data = result.data;
      _this.setData(data);
    });
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
    this.setData({role: App.globalData.role})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
