// pages/driver/index.js
const App = getApp();
let copyReturnBackData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    returnBackData: [],
    dataType: '1',
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    page: 1 // 当前页码
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
    this.getReturnbackData();
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

  /*
    获取商铺退桶记录
  */
 getReturnbackData() {
   let _this = this;
   App._get(
     "asset/recivePageList", 
   {wxapp_id: App.getWxappId()},
   function(res) {
    _this.setData({
      returnBackData: res.data.data.filter(item => item.status.value === 1)
     })
     copyReturnBackData = JSON.parse(JSON.stringify(res.data.data))
   }
   )
 },




  /**
   * 切换标签
   */
  bindHeaderTap(e) {
    this.setData({
      dataType: e.currentTarget.dataset.type,
      list: {},
      isLoading: true,
      page: 1,
      no_more: false,
    });

    let temp = copyReturnBackData.filter(item => item.status.value == e.currentTarget.dataset.type)
    this.setData({
      returnBackData: temp
    })
    // 获取订单列表
    //this.getReturnbackData(e.currentTarget.dataset.type);
    //this.getReturnbackData();
  },

})