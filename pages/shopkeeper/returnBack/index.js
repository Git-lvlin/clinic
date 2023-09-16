// pages/shopkeeper/returnBack/index.js
const App  = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rangeData: [],
    index: 0,
    amount: '',
    category_id: '',
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // let a = wx.getCurrentPages();
     // console.log(a)
     let _this = this;
     App._get(
       'asset/setting', 
       {wxapp_id: 10001},
       function(res){
         _this.setData({
          rangeData: res.data.category_records,
          category_id: res.data.category_records[0].category_id
         })
       }
       )
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

  /* */
  handlePickerChange(e) {
    let _this = this;
    let index = e.detail.value;
    index = isNaN(index) ? 0 : Number(index);
    _this.setData({index,category_id: _this.data.rangeData[index]})  
  },

  /*新增一条*/
  createMore(e) {
    let _this = this;
    let values = e.detail.value;
    if(!values.amount) return;
    let temp = [];
    let index = Number(values.category_id);
    let item = _this.data.rangeData[index]
    temp = temp.concat(this.data.items);

    let result = temp.some(item => {
      if(item.category_id === values.category_id) {
        item.amount += Number(values.amount);
        return true;
      }
    })

    if(!result) {
      temp.push({
        type: 1,
        category_id: values.category_id,
        category_name: item.category_name,
        amount: Number(values.amount)
      })
    }
    
    this.setData({
      items: temp,
      amount: ""
    })
  },

  /*submit form*/
  submitForm(e) {
    if(this.data.items.length === 0) return;
    let _this = this;
    let values = e.detail.value;
    let query = "?token=" + wx.getStorageSync('token');
    let fullUrl = App.api_root + "asset/refund";
    query+= "&wxapp_id=" + App.getWxappId()
    wx.request({
      url: fullUrl + query,
      method: "POST",
      data: {
        token: wx.getStorageSync("token"),
        wxapp_id: App.getWxappId(),
        shop_id: App.globalData.shop_id || "32",
        items: _this.data.items,
      },
      success(res) {
        App.showSuccess('提交成功')
        _this.setData({items: []})
      },

      fail(err) {
        console.log(err)
      }
    })
  
  }
})