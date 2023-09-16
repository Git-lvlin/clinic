const App = getApp();

// 枚举类：发货方式
import DeliveryTypeEnum from '../../../utils/enum/DeliveryType.js';

// 枚举类：支付方式
import PayTypeEnum from '../../../utils/enum/order/PayType'

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
    this.getOrderList(this.data.dataType);
  },

  /**
   * 获取订单列表
   */
  getOrderList(isPage, page) {
    let _this = this;
    App._get('sharing.active/myactive', {
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
    this.getOrderList(e.currentTarget.dataset.type);
  },

  /**
   * 跳转到拼团详情
   */
  navigateToSharingActive(e) {
    // 记录formId
    App.saveFormId(e.detail.formId);
    let active_id = e.detail.target.dataset.id;
    wx.navigateTo({
      url: '../active/index?active_id=' + active_id
    });
  },

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

  /**
   * 查看核销二维码
   */
  onExtractQRCode(e) {
    let _this = this,
      order_id = e.currentTarget.dataset.id;
    // 调用后台api获取核销二维码
    wx.showLoading({
      title: '加载中',
    });
    App._get('sharing.order/extractQrcode', {
      order_id
    }, (result) => {
      // 设置二维码图片路径
      _this.setData({
        QRCodeImage: result.data.qrcode
      });
      // 显示核销二维码
      _this.onToggleQRCodePopup();
    }, null, () => {
      wx.hideLoading();
    });
  },

  /**
   * 核销码弹出层
   */
  onToggleQRCodePopup() {
    let _this = this;
    _this.setData({
      showQRCodePopup: !_this.data.showQRCodePopup
    });
  },

});
