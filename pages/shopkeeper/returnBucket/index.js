// pages/shopkeeper/returnBucket/index.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: 3,
    taskList: {data: []}
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
    this.returnBucketTask();
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
    this.returnBucketTask();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.returnBucketTask()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },

  /*退桶事务列表 */
  returnBucketTask() {
    let _this = this;
    App._get('shop.bucket/pageList', {
      wxapp_id: App.getWxappId(), 
      token: wx.getStorageSync('token'),
      status: _this.data.dataType
    },
    function(res) {
      _this.setData({
        taskList: res.data.list
      })
    }, null, function(){
      wx.stopPullDownRefresh()
    })
  },


  /*用户退还桶确认*/
  returnBucketConfirm(e) {
    let _this = this;
    App._post_form('user.Deposit/shopReceipt', {
      deposit_id: e.currentTarget.dataset.id
    }, function() {
      App.showSuccess('确认成功')
      _this.returnBucketTask();
    })
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
    // 获取订单列表
    this.returnBucketTask();
  },
})