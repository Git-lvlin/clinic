const App = getApp();
const pageIndex = 'category/list::';
var sliderWidth = 96;
Page({
  data: {
    scrollHeight: 0,
    showView: true, // 列表显示方式
    sortType: 'all', // 排序类型
    sortPrice: false, // 价格从低到高
    option: {}, // 当前页面参数
    list: {}, // 商品列表数据
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    pagination: 1, // 当前页码
    tabs: [],
    activeIndex: 0,
    scrollTop: 0,
    makeAnchorByCategory: [],
    items: [],
    options: ""
    //sliderOffset: 0,
    //sliderLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    let _this = this;
    // 设置商品列表高度
    _this.setListHeight();
    // 记录option
    _this.setData({
      option
    });
    // 设置列表显示方式
    //_this.setShowView();

    // 获取分类列表
    _this.getCategoryList();

    this.setData({
      options:option
    });

    _this.getPageData();
  },

  onShow() {
    //let recentSearch = wx.getStorageSync('recentSearch') || [];
    // if(recentSearch.length) {
    //   let keyword = recentSearch[0];
    // }
  },


  /**
   * 设置默认列表显示方式
   */
  setShowView() {
    let _this = this;
    _this.setData({
      showView: wx.getStorageSync(pageIndex + 'showView') || false
    });
  },

  /**
   * 获取商品列表
   * @param {bool} isPage 是否分页
   * @param {number} page 指定的页码
   */
  getGoodsList(isPage, page, category_id) {
    let _this = this;
    App._get("goods/lists", {
      page: page || 1,
      listRows: 10,
      sortType: this.data.sortType,
      sortPrice: this.data.sortPrice ? 1 : 0,
      category_id: category_id || "",
      search: this.data.option.search || '',
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
      wx.nextTick(() => {
        let temp = [];
        const query = wx.createSelectorQuery();
        _this.data.tabs.forEach(item => {
          query.select('._' + item.category_id).boundingClientRect(function (res) {
            res = res || {
              top: 0
            }
            !temp.includes(res.top) && temp.push(res.top)
          }).exec();
        })
        _this.setData({
          makeAnchorByCategory: temp
        })
      })
    });
  },
  

  /**
   * 设置商品列表高度
   */
  setListHeight() {
    let _this = this;
    wx.getSystemInfo({
      success: res => {
        _this.setData({
          scrollHeight: res.windowHeight - 99,
        });
      }
    });
  },

  /**
   * 切换排序方式
   */
  switchSortType(e) {
    let _this = this,
      newSortType = e.currentTarget.dataset.type,
      newSortPrice = newSortType === 'price' ? !this.data.sortPrice : true;

    this.setData({
      list: {},
      isLoading: true,
      pagination: 1,
      sortType: newSortType,
      sortPrice: newSortPrice

    }, () => {
      // 获取商品列表
      _this.getGoodsList();
    });
  },

  /**
   * 切换列表显示方式
   */
  // onChangeShowState() {
  //   let _this = this;
  //     //showView = !_this.data.showView;
  //   wx.setStorageSync(pageIndex + 'showView', true);
  //   _this.setData({
  //     showView: !_this.data.showView
  //   });
  // },

  /**
   * 下拉到底加载数据
   */
  onReachBottom(){
    if (this.data.pagination >= this.data.list.last_page) {
      this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    let category_id = "";
    if(this.data.activeIndex >= 0) {
      if(this.data.tabs[this.data.activeIndex].title.indexOf("首页") > -1) {
        category_id = "";
      } else if(this.data.activeIndex >= 0){
        category_id = this.data.tabs[this.data.activeIndex].category_id;
      }
    } else {
      category_id = "";
    }
    
    this.getGoodsList(true, ++this.data.pagination, category_id);
  },

  /**
   * 商品搜索
   */
  triggerSearch() {
    let pages = getCurrentPages();
    // 判断来源页面
    if (pages.length > 1 &&
      pages[pages.length - 2].route === 'pages/search/index') {
      wx.navigateBack();
      return;
    }
    // 跳转到商品搜索
    wx.navigateTo({
      url: '../search/index',
    })
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage() {
    // 构建分享参数
    return {
      title: "全部分类",
      path: "/pages/category/index?" + App.getShareUrlParams()
    };
  },

  /**
   * 分享到朋友圈
   * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
   * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
   */
  onShareTimeline() {
    // 构建分享参数
    return {
      title: "全部分类",
      path: "/pages/category/index?" + App.getShareUrlParams()
    };
  },

  /**
   * 获取分类列表
   */
  getCategoryList() {

    let _this = this;
    App._get('category/index', {}, result => {
      let data = result.data;
      console.log(data)
      _this.setData({
        list: data.list,
        templet: data.templet,
        curNav: data.list.length > 0 ? data.list[0].category_id : true,
        notcont: !data.list.length,
        tabs: data.list.map(item => {
          return {
            category_name: item.name,
            category_id: item.category_id,
            title: item.name
          }
        })
      });

      // 获取商品列表
      _this.getGoodsList();
    });
  },

  /**
   * 加载页面数据
   */
  getPageData(callback) {
    let _this = this;
    App._get('page/index', {
      page_id: _this.data.options.page_id || 0
    }, result => {
      // 设置顶部导航栏栏
      _this.setData(result.data);
      // 回调函数
      typeof callback === 'function' && callback();
    });
  },

  tabClick: function (e) {
    let _this = this;
    this.setData({
      pagination: 1,
      activeIndex: e.detail.index,
      scrollTop: _this.data.makeAnchorByCategory[e.detail.index] - 100
    });
    let category_id = "";
    if(_this.data.tabs[_this.data.activeIndex].title.indexOf("首页") > -1) {
      category_id = "";
    } else {
      category_id = _this.data.tabs[_this.data.activeIndex].category_id;
    }
    this.getGoodsList(false, 1, category_id);
  },

  // addCard(e) {
  //   let _this = this
  //   var goods_id = e.currentTarget.dataset.goods_id
  //   var goods_num = 1
  //   var spec_sku_id = e.currentTarget.dataset.spec_sku_id
  //   let url = App.getUrl('warehouse.cart/add', 'cart/add')
  //   // return
  //   App._post_form(url, {
  //     goods_id: goods_id,
  //     goods_num: goods_num,
  //     goods_sku_id: spec_sku_id,
  //   }, (result) => {
  //     App.showSuccess(result.msg);
  //     // _this.setData(result.data);
  //     // 记录购物车商品数量
  //     App.setCartTotalNum(result.data.cart_total_num)
  //     App.setCartTabBadge()
  //   });
  // },
});