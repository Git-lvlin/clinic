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

    // 配送方式
    DeliveryTypeEnum,

    // 支付方式
    PayTypeEnum,

    order_id: null,
    order: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    _this.data.order_id = options.order_id;
    // 获取订单详情
    _this.getOrderDetail(options.order_id);
  },

  /**
   * 获取订单详情
   */
  getOrderDetail(order_id) {
    let _this = this;
    App._get('shop.SharingOrder/detail', {
      order_id
    }, result => {
      _this.setData(result.data);
    });
  },

  /**
   * 跳转到商品详情
   */
  onTargetGoods(e) {
    let goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods/index?goods_id=' + goods_id
    });
  },

  /**
   * 取消订单
   */
  cancelOrder(e) {
    let _this = this;
    let order_id = _this.data.order_id;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success(o) {
        if (o.confirm) {
          App._post_form('user.order/cancel', {
            order_id
          }, result => {
            wx.navigateBack();
          });
        }
      }
    });
  },


  /**
   * 确认发货
   */
  toDelivery(e) {
    let _this = this;
    App._post_form('shop.SharingOrder/delivery', {
      order_id: _this.data.order_id,
      shop_id: App.globalData.shop_id,
    }, result => {
      _this.getOrderDetail(_this.data.order_id);
    });
  },


  /**
   * 申请售后
   */
  onApplyRefund(e) {
    wx.navigateTo({
      url: './refund/apply/apply?order_goods_id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 跳转到门店详情
   */
  onTargetShop(e) {
    wx.navigateTo({
      url: '../shop/detail/index?shop_id=' + e.currentTarget.dataset.id,
    })
  },
});