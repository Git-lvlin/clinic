const App = getApp();

Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    itemIndex: String,
    itemStyle: Object,
    params: Object,
    dataList: Object
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {

    /**
     * 跳转商品详情页
     */
    _onTargetGoods(e) {
      wx.navigateTo({
        url: '/pages/goods/index?goods_id=' + e.detail.target.dataset.id,
      });
    },

    addCard(e) {
      let _this = this
      var goods_id = e.currentTarget.dataset.goods_id
      var goods_num = 1
      var spec_sku_id = e.currentTarget.dataset.spec_sku_id
      // return
      App._post_form('cart/add', {
        goods_id: goods_id,
        goods_num: goods_num,
        goods_sku_id: spec_sku_id,
      }, (result) => {
        // console.log('result ', result)
        App.showSuccess(result.msg);
        // _this.setData(result.data);
        // 记录购物车商品数量
        App.setCartTotalNum(result.data.cart_total_num)
        App.setCartTabBadge()
      });
    },
  },
})
