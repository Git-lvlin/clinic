// pages/sale-men/index.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: '1',
    task: {}
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

    this.getTaskList(this.data.dataType)
    // 获取订单列表
    //this.getOrderList(e.currentTarget.dataset.type);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTaskList(this.data.dataType);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
    this.getTaskList(this.data.dataType)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let _this = this;
    this.setData({
      page: _this.data.page++
    })
    this.getTaskList(this.data.dataType)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /*获取任务列表*/
  getTaskList(type) {
    let _this = this;
    let token = wx.getStorageSync('token')
    if(!token) {
      App.showError('请先登录')
      return;
    }

    App._get('user.task/pageList', {
      wxapp_id: App.getWxappId(),
       token, 
       listRows: 10,
       status: type,
       page: _this.data.page
      }, function(res) {
      _this.setData({
        task: res.data,
        page: res.data.current_page
      })
    },null, function() {
      wx.stopPullDownRefresh();
    })
  },

   /* 查看任务详情 */
  toHanleTask(e) {
    if(!e.currentTarget.dataset.taskid){
      return
    }

    wx.navigateTo({
      url: './task-flow?id='+e.currentTarget.dataset.taskid,
    })
  },
})