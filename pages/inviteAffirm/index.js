// pages/inviteAffirm/index.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userHeaderBGC:'#ff6150'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var titleTextColor = wx.getStorageSync('titleTextColor')
    var titleBackgroundColor = wx.getStorageSync('titleBackgroundColor')
    if (titleTextColor && titleBackgroundColor) {
      // 设置navbar标题、颜色
      wx.setNavigationBarColor({
        frontColor: titleTextColor,
        backgroundColor: titleBackgroundColor
      })
    }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  getUserInfo(e) {
    if (!App.checkMobileAcquired()) {
      App.showError('请先授权微信绑定的手机号');
      return;
    }
    let _this = this;
    App.getUserInfo(e, () => {
      wx.removeStorageSync('referee_id_Login')
      wx.switchTab({
        url: '/pages/index/index'
      })
    });
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
