// pages/globalSearch/index.js
const App = getApp();
let timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleSearch({detail: {value: ""}})
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

  },

  /*全局搜索*/
  handleSearch(e){
    let that = this;
    let { value } = e.detail;
    let temp = App.globalData.storeList;
    timer && clearTimeout(timer);
    timer = setTimeout(function(){
      that.setData({
        shopList: temp.filter(item => {
          return item.address.indexOf(value) > -1
          || item.linkman.indexOf(value) > -1
          || item.shop_name.indexOf(value) > -1
        })
      })
    }, 400)
  },

})