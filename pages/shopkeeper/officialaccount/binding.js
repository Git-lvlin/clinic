// pages/shopkeeper/officialaccount/binding.js
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openUrl: "",
    isLoading: true,
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    var openUrl = App.api_root + "OfficialAccount/binding&token=" + wx.getStorageSync('token') + "&wxapp_id=" + App.getWxappId()

    this.setData({
      openUrl: openUrl,
    })
  },

  /**
   * 获取请求数据
   */
  handleGetMessage: function (e) {
    this.setData({
      isLoading: false
    })
    console.log("handleGetMessage", e.detail.data);
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