const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //
    page: [],

    // show
    notcont: false,

    isLoading: true, // 是否正在加载中
    current_page: 1, // 当前页码
    last_page: 1, // 最后页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 当前页面参数
    this.data.options = options;

    // 设置scroll-view高度
    this.setListHeight();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取优惠券列表
    this.getPagelist();
  },


  /**
   * 设置商品列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 88), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    this.setData({
      scrollHeight
    });
  },


  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {

    // 已经是最后一页
    if (this.data.current_page >= this.data.last_page) {
      this.setData({
        notcont: true
      });
      return false;
    }
    // 加载下一页列表
    this.getPagelist(true, ++this.data.current_page);
  },

  /**
   * 获取优惠券列表
   */
  getPagelist(isPage, page) {
    let _this = this;
    App._get('oilcard.Oilcard/page', {
      listRows: 8,
      page: page || 1
    }, function (result) {
      let resList = result.data.data,
        dataList = _this.data.page;
      if (isPage) {
        _this.setData({
          page: dataList.concat(resList),
          current_page: page,
          last_page: result.data.last_page,
          notcont: !result.data.total
        });
      } else {
        _this.setData({
          page: resList,
          last_page: result.data.last_page,
          notcont: !result.data.total
        });
      }
    });
  },


  /**
   * 绑定油卡
   */
  bindOilcardPage: function () {
    wx.navigateTo({
      url: './bind?'
    })
  },

  editOilcard: function (e) {
    var oilcard_id = e.currentTarget.dataset.oilcard_id;
    var oilcard_type = e.currentTarget.dataset.oilcard_type;
    var oilcard_number = e.currentTarget.dataset.oilcard_number;
    var remark = e.currentTarget.dataset.remark;

    var query = 'oilcard_id=' + oilcard_id + '&oilcard_type=' + oilcard_type + '&oilcard_number=' + oilcard_number + '&remark=' + remark
    console.log(query)
    wx.navigateTo({
      url: './bind?' + query
    })
  },

  oilcardRecharge: function (e) {
    console.log('e ', e)
    var oilcard_id = e.currentTarget.dataset.oilcard_id;
    var oilcard_type = e.currentTarget.dataset.oilcard_type;
    var oilcard_number = e.currentTarget.dataset.oilcard_number;
    var remark = e.currentTarget.dataset.remark;

    var query = 'oilcard_id=' + oilcard_id + '&oilcard_type=' + oilcard_type + '&oilcard_number=' + oilcard_number + '&remark=' + remark
    // var query = 'oilcard_id=' + oilcard_id
    console.log(query)
    wx.navigateTo({
      url: './recharge?' + query
    })
  },
});