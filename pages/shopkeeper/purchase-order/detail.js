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
    _this.getOrderDetail();
  },

  /**
   * 获取订单详情
   */
  getOrderDetail(order_id) {
    let _this = this;
    App._get('shop.PurchaseOrder/detail', {
      order_id:_this.data.order_id
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
      url: '../../warehouse/goods/index?goods_id=' + goods_id
    });
  },



  /**
   * 确认收货
   */
  receipt() {
    let _this = this;
    wx.showModal({
      title: "提示",
      content: "确认收到商品？",
      success(o) {
        if (o.confirm) {
          App._post_form('shop.PurchaseOrder/receipt', {
            order_id: _this.data.order_id
          }, result => {
            _this.getOrderDetail();
          });
        }
      }
    });
  },


});
