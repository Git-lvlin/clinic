// pages/shopkeeper/returnBack/returnBackRecordList/index.js
const App = getApp();
Page({

 /**
   * 页面的初始数据
   */
  data: {
    dataType: '0', // 列表类型
    list: [], // 订单列表
    scrollHeight: null, // 列表容器高度
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    recordData: [],
    page: 1, // 当前页码
    returnBackData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReturnbackData();
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
   this.getRecordList();
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
    this.getRecordList();
  },

  /**/
  removeRecord(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    
    if(id === "" || id === undefined || id === null) {
      return;
    }
    let query = "&token=" + wx.getStorageSync('token');
    query+="&wxapp_id=" + App.getWxappId()
    let fullUrl = App.api_root + 'asset/delete' + query;
    wx.request({
      url: fullUrl,
      method: "POST",
      data: {
        asset_log_id: id,
      },
      success(res) {
        if(res.data.code === 1) {
          App.showSuccess('删除成功')
        } else {
          App.showSuccess(res.data.msg)
        }
        App.showSuccess(res.data.msg)
        let temp = _this.data.recordData.filter(item => item.asset_log_id !== id)
        _this.setData({
          recordData: temp
        })
        _this.getRecordList();
      }
    })
  },

  /**/
  getRecordList() {
    let _this = this;
    let fullUrl = App.api_root + "asset/pageList";
    wx.request({
      url: fullUrl,
      data: {
        token: wx.getStorageSync('token'),
        wxapp_id: App.getWxappId(),
        shop_id: App.globalData.shop_id,
        status: this.data.dataType,
      },
      method: "GET",
      success(res) {
        _this.setData({
          recordData: res.data.data.data
        })
      },
      fail(err) {
        console.error(err)
      }
    })
  },


   /*
 确认收桶 */
 confirmReturn(e){
  let _this = this;

  let queryStr = "&token=" + wx.getStorageSync('token');
  queryStr += "&wxapp_id=" + App.getWxappId();

  let params = {};
  let temp = this.data.returnBackData.find(item => {
    return item.asset_log_id === item.asset_log_id
  })

  params.asset_log_id = temp.asset_log_id;
  params.items = temp.attach.items.map(item => {
    return {
     type: item.type,
     category_id: item.category_id,
     amount: item.category_id
    }
  })

  wx.request({
    url: App.api_root + "asset/recive" + queryStr,
    method: "POST",
    data: params,
    success: function(res){
      if(res.data.code === 1) {
       App.showSuccess('收桶成功')
       _this.getReturnbackData();
       _this.getRecordList();
      } else {
       App.showSuccess(res.data.msg)
      }
    }
  })
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
   // copyReturnBackData = JSON.parse(JSON.stringify(res.data.data))
  }
  )
},
})