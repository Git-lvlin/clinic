// pages/invite.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userHeaderBGC:'#ff6150',
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var titleTextColor = wx.getStorageSync('titleTextColor')
    var titleBackgroundColor = wx.getStorageSync('titleBackgroundColor')
    this.getreferee()
    // if (titleTextColor && titleBackgroundColor) {
    //   // 设置navbar标题、颜色
    //   wx.setNavigationBarColor({
    //     frontColor: titleTextColor,
    //     backgroundColor: titleBackgroundColor
    //   })
    // }
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
  getreferee(){
    let _this = this;
    App._get('user/referee', {
      referee_id:wx.getStorageSync('referee_id')
    }, result => {
      _this.setData({'info':result.data});
    });
  },
  getPhoneNumber(e) {
    let _this = this;
    //同意授权
    App.getPhoneNumber(e, (res) => {
        wx.setStorageSync('referee_id_Login', 2)
        wx.reLaunch({
          url:'/pages/inviteAffirm/index'
        })
    });
  },
  onTargetMenus(){
    wx.switchTab({
      url: '/pages/index/index'
    })
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
