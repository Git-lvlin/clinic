// pages/user/spectLocation/index.js
const App = getApp();
let params = {shop_id: '', longitude: '', latitude: ''};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [],
    selectedIndex: -1,
    coordinate: {
      longitude: '',
      latitude: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    App._get('shop/lists', {
      longitude: 113.751884,
      latitude: 23.020893,
    }, (result) => {
      result = result.data.list.map(item => {
        return {
          shop_name: item.shop_name,
          id: item.shop_id
        }
      })
      _this.setData({
        shopList: result,
      });
    });
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

  /* 获取用户地理位置 */
  getUserLocation() {
    const _this = this;
    wx.showLoading({
      title: '定位中',
    })
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      isHighAccuracy: true,
      success: function(obj) {
        _this.setData({
          coordinate: {
            longitude: obj.longitude,
            latitude: obj.latitude
          }
        })

        params.longitude = obj.longitude;
        params.latitude = obj.latitude;
      },
      complete(){
        wx.hideLoading()
      },
    })
  },

  /* 监听水店选择 */
  handlePickerChange(event){
    let index = parseInt(event.detail.value);
    if(!Number.isNaN(index)) {
      this.setData({
        selectedIndex: index
      })
      params.shop_id = this.data.shopList[index].id;
    }
  },

  /* 更新水店坐标 */
  updateCoordinate() {
    const _this = this;
    App._get(
      'shop/changeInfo',
      params,
      function() {
        App.showSuccess('提交成功', function(){
          wx.navigateBack({
            delta: 1,
          })
        });
      }
    )
  }
})