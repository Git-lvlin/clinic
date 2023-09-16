// pages/sale-men/write-info.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    delete: true,
    multiple: 10,
    remark: '',
    task_id: '',
    address: '',
    longitude: '',
    latitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      task_id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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


  /*上传文件 weui组件上传*/
  handleUploadFile2({
    detail
  }) {
    var that = this;

    let query = '';
    query += '&wxapp_id=' + App.getWxappId();
    query += '&token=' + wx.getStorageSync('token');

    const tempFilePaths = detail.tempFilePaths;

    tempFilePaths.forEach((file, i) => {
      let index = that.data.files.push({
        url: file,
        loading: true
      })
      wx.uploadFile({
        url: 'https://dev.quantianxia.xin/index.php?s=/api/upload/image' + query,
        filePath: file,
        name: 'iFile',
        success(res) {
          let data = JSON.parse(res.data)
          that.data.files[index - 1].loading = false;
          that.data.files[index - 1].url = data.data.file_path;
          that.setData({
            files: that.data.files
          })
        }
      })
    })

  },


  /*获取文本框的值*/
  handleDescriptionInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },


  // 获取当前地址名
  getLocationName() {
    const _this = this;
    wx.showLoading({
      title: '处理中',
    })
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success(res) {

        _this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })

        let params = {
          location: res.latitude + ',' + res.longitude,
          get_poi: 0,
          key: 'IRRBZ-7233S-56XOG-6RNVS-NZUYV-SUFHK',
          output: 'JSON',
        };

        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: params,
          method: 'GET',
          success: function (res) {
            _this.setData({
              address: res.data.result.address
            })
            _this.submitContent();
          },
          complete() {
            wx.hideLoading()
          },
        })
      },
      complete() {
        wx.hideLoading()
      },
    })
  },

  /*提交*/
  submitContent() {
    let _this = this;
    let data = this.data;
    let params = {};
    params.wxapp_id = App.getWxappId();
    params.token = wx.getStorageSync('token');
    params.task_id = data.task_id;
    params.remark = data.remark;
    params.address = data.address;
    params.latitude = data.latitude;
    params.longitude = data.longitude;

    params.attach = data.files.map(item => item.url).join(',')
    if (!params.token || !params.task_id || !params.remark || !params.attach) {
      App.showSuccess('请检查必填项')
      return;
    }

    App._post_form('user.task/situation', params,
      res => {
        App.showSuccess('提交成功', function () {
          wx.navigateBack({
            delta: 1,
          })
        })
      })
  },


})