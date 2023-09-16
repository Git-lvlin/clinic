// pages/user/cash-pledge/index.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deposit_id: '',
    pay_status: {value:10, text: '未支付'},
    pay_price: '',
    status: {value:0, text: '未交押金'}
    , // 1完成 2已退桶 3 退款中 4已交押金
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.getPledgeInfo();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  topay() {
    wx.navigateTo({
      url: './payment',
    })
  },

  rebackPledge() {
    if(this.data.status.value === 4) {
      let _this = this;
      wx.navigateTo({
        url: './reback-pledge?param='+_this.data.deposit_id,
      })
    }
  },

  getPledgeInfo() {
    let _this = this;
    App._get('user.Deposit/detail', {
        wxapp_id: App.getWxappId,
        token: wx.getStorageSync('token'),
        deposit_type: 10
      },

      function (res) {
        res.data &&
          _this.setData({
            pay_price: res.data.pay_price,
            pay_status: res.data.pay_status,
            deposit_id: res.data.deposit_id,
            status: res.data.status // 3 退款中 4已交押金
          })
      })
  },
})