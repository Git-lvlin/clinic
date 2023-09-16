const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    dataType: 'all', // 列表类型
    list: [], // 订单列表
    scrollHeight: null, // 列表容器高度


    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中

    page: 1, // 当前页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 设置scroll-view高度
    _this.setListHeight();
    // 设置数据类型
    _this.setData({
      dataType: options.type || 'all'
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取订单列表
    this.getOrderList();
  },

  /**
   * 获取订单列表
   * @arguments {Boolean} isPage true在请求分页数据
   * @arguments {Number} page 页码数
   */

  getOrderList(isPage, page) {
    let _this = this;
    App._get('shop.withdraw/lists', {
      wxapp_id: App.getWxappId(),
      token: wx.getStorageSync('token'),
      data_type: _this.data.dataType,
      shop_id: App.globalData.shop_id,
      listRows: 10,
      page: page || 1,
      dataType: _this.data.dataType
    }, result => {
      let resList = result.data.list,
        dataList = _this.data.list;

      if (isPage == true) {
        _this.setData({
          'list.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          list: resList,
          isLoading: false,
        });
      }
    });
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
    this.getOrderList();
  },


  /**
   * 确认发货
   */
  toDelivery(e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;
    App._post_form('shop.order/delivery', {
      order_id: order_id,
      shop_id: App.globalData.shop_id,
    }, result => {
      _this.getOrderList(_this.data.dataType);
    });
  },


  /**
   * 跳转订单详情页
   */
  navigateToDetail(e) {
    let order_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order/detail?order_id=' + order_id
    });
  },

  /*触底加载更多*/

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    // 已经是最后一页
    if (this.data.page >= this.data.list.last_page) {
      this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    this.getOrderList(true, ++this.data.page);
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

});
