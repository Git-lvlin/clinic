const App = getApp();

// 工具类
import Util from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {

    isLogin: false,
    // 商品列表
    goods_list: [],
    // 当前动作
    action: 'complete',
    // 选择的商品
    checkedData: [],
    // 是否全选
    checkedAll: false,
    // 商品总价格
    cartTotalPrice: '0.00',
    order_total_quantity: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var titleTextColor = wx.getStorageSync('titleTextColor')
    var titleBackgroundColor = wx.getStorageSync('titleBackgroundColor')
    if (titleTextColor && titleBackgroundColor) {
      // 设置navbar标题、颜色
      wx.setNavigationBarColor({
        frontColor: titleTextColor,
        backgroundColor: titleBackgroundColor
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    if (_this.data.isLogin) {
      // 获取购物车列表
      _this.getCartList();
    }

    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar()
        this.setData({
          selected: 1
        })
      }
  },

  /**
   * 获取购物车列表
   */
  getCartList() {
    let _this = this;
    let url = 'warehouse.cart/lists';
    App._get(url, {}, res => {
      _this._initGoodsChecked(res.data)
      App.setCartTotalNum(res.data.order_total_num, 'cartTotalNumWareHouse'); //更新购物车角标的数量
    });
  },

  /**
   * 初始化商品选中状态
   */
  _initGoodsChecked(data) {
    let _this = this;
    let checkedData = _this.getCheckedData();
    // 将商品设置选中
    data.goods_list.forEach(item => {
      item.checked = Util.inArray(`${item.goods_id}_${item.goods_sku_id}`, checkedData);
    });
    _this.setData({
      goods_list: data.goods_list,
      order_total_price: data.order_total_price,
      order_total_quantity: data.order_total_num,
      action: 'complete',
      checkedAll: checkedData.length == data.goods_list.length,
    });
   
    // 更新购物车已选商品总价格
    _this.updateTotalPrice();
  },

  /**
   * 选择框选中
   */
  onChecked(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      goods = _this.data.goods_list[index],
      checked = !goods.checked;
    // 选中状态
    _this.setData({
      ['goods_list[' + index + '].checked']: checked
    });
    // 更新选中记录
    _this.onUpdateChecked();
    // 更新购物车已选商品总价格
    _this.updateTotalPrice();
    // 更新全选状态
    _this.setData({
      checkedAll: _this.getCheckedData().length == _this.data.goods_list.length
    });
  },

  /**
   * 获取选中的商品
   */
  getCheckedData() {
    let checkedData = wx.getStorageSync('checkedData');
    return checkedData ? checkedData : [];
  },

  /**
   * 选择框全选
   */
  onCheckedAll(e) {
    let _this = this,
      goodsList = _this.data.goods_list;
    // 更新商品选中记录
    goodsList.forEach(item => {
      item.checked = !_this.data.checkedAll;
    });
    _this.setData({
      goods_list: goodsList,
      checkedAll: !_this.data.checkedAll
    });
    // 更新购物车已选商品总价格
    _this.updateTotalPrice();
    // 更新选中记录
    _this.onUpdateChecked();
  },

  /**
   * 更新商品选中记录
   */
  onUpdateChecked() {
    let _this = this,
      checkedData = [];
    _this.data.goods_list.forEach(item => {
      if (item.checked == true) {
        checkedData.push(`${item.goods_id}_${item.goods_sku_id}`);
      }
    });
    wx.setStorageSync('checkedData', checkedData);
  },

  /**
   * 切换编辑/完成
   */
  switchAction(e) {
    let _this = this;
    _this.setData({
      action: e.currentTarget.dataset.action
    });
  },

  /**
   * 删除商品
   */
  onDelete() {
    let _this = this,
      cartIds = _this.getCheckedIds();
    if (!cartIds.length) {
      App.showError('您还没有选择商品');
      return false;
    }
    wx.showModal({
      title: "提示",
      content: "您确定要移除选择的商品吗?",
      success(e) {
        e.confirm && App._post_form('warehouse.cart/delete', {
          goods_sku_id: cartIds
        }, result => {
          // 删除选中的商品
          _this.onDeleteEvent(cartIds);
          // 获取购物车列表
          _this.getCartList();
        });
      }
    });
  },

  /**
   * 商品删除事件
   */
  onDeleteEvent(cartIds) {
    let _this = this;
    cartIds.forEach((cartIndex) => {
      _this.data.goods_list.forEach((item, goodsIndex) => {
        if (cartIndex == `${item.goods_id}_${item.goods_sku_id}`) {
          _this.data.goods_list.splice(goodsIndex, 1);
        }
      });
    });
    // 更新选中记录
    _this.onUpdateChecked();
    return true;
  },

  /**
   * 获取已选中的商品
   */
  getCheckedIds() {
    let _this = this;
    let arrIds = [];
    _this.data.goods_list.forEach(item => {
      if (item.checked === true) {
        arrIds.push(`${item.goods_id}_${item.goods_sku_id}`);
      }
    });
    return arrIds;
  },

  /**
   * 更新购物车已选商品总价格
   */
  updateTotalPrice() {
    let _this = this;
    let cartTotalPrice = 0;
    _this.data.goods_list.forEach(item => {
      if (item.checked === true) {
        cartTotalPrice = _this.mathadd(cartTotalPrice, item.total_price);
      }
    });
    _this.setData({
      cartTotalPrice: Number(cartTotalPrice).toFixed(2)
    });
  },

  /**
   * 递增指定的商品数量
   */
  onAddCount(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      goodsSkuId = e.currentTarget.dataset.skuId,
      goods = _this.data.goods_list[index];
    // order_total_price = _this.data.order_total_price;
    // 后端同步更新
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    App._post_form('warehouse.cart/add', {
      goods_id: goods.goods_id,
      goods_num: 1,
      goods_sku_id: goodsSkuId
    }, () => {
      // 获取购物车列表
      _this.getCartList();
    }, null, () => {
      wx.hideLoading();
    });
  },

  /**
   * 递减指定的商品数量
   */
  onSubCount(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      goodsSkuId = e.currentTarget.dataset.skuId,
      goods = _this.data.goods_list[index];
    if (goods.total_num > 1) {
      // 后端同步更新
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      App._post_form('warehouse.cart/sub', {
        goods_id: goods.goods_id,
        goods_sku_id: goodsSkuId
      }, () => {
        // 获取购物车列表
        _this.getCartList();
      }, null, () => {
        wx.hideLoading();
      });
    }
  },

  /**
   * 购物车结算
   */
  submit() {
    let _this = this,
      cartIds = _this.getCheckedIds();
    if (!cartIds.length) {
      App.showError('您还没有选择商品');
      return false;
    } else if (this.data.order_total_quantity < App.globalData.leastOrderQuantity) {
      App.showError('最小起订量为'+App.globalData.leastOrderQuantity+'桶');
      return;
    }
    wx.navigateTo({
      url: '../flow/checkout?order_type=cart&cart_ids=' + cartIds
    });
  },

  /*加法*/
  mathadd(arg1, arg2) {
    return parseFloat((parseFloat(arg1) + parseFloat(arg2)).toFixed(2));
  },

  /*减法*/
  mathsub(arg1, arg2) {
    return parseFloat((parseFloat(arg1) - parseFloat(arg2)).toFixed(2));
  },

})
