// pages/sale-men/task-flow.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gallery: false,
    task_object: '',
    task_id: '',
    status: {value: 3}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({task_id: options.id})
  },

  close: function() {
    this.setData({
        gallery: false,
    });
},

open: function () {
    this.setData({
        gallery: true
    });
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    App._get('user.task/detail', {
      wxapp_id: App.getWxappId(),
      token: wx.getStorageSync('token'),
      task_id: _this.data.task_id
    },
    res => {
      _this.setData({
        task_object: res.data,
        status: res.data.status
      })
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

  },

  previewImage: function(e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },

  /*去写备忘*/
  goToWrite() {
    wx.navigateTo({
      url: './write-info?id='+this.data.task_id,
    })
  },

  /* 结束任务 */
  handleFinishTask() {
    let _this = this;
    if(_this.data.status.value === 3) {
      App.showError('任务已结束')
      return;
    }

    App._get('user.task/finish', {
      wxapp_id: App.getWxappId(),
      task_id: _this.data.task_id,
      token: wx.getStorageSync('token')
    },

    res => {
      App.showSuccess('结束任务成功', function() {
        wx.navigateBack({
          delta: 1,
        })
      })
    })
  },

  /* 打开地图组件 */
  openMap(e) {
    let {dataset} = e.currentTarget;
    wx.openLocation({
      longitude: parseFloat(dataset.long),
      latitude: parseFloat(dataset.lat),
      name: dataset.name,
      fail(){
      },
    })
  }
})