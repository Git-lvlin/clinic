Component({

  options: {},

  data: {
    scrollHeight: 0
  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    diyItems: Object
  },

  attached(){
    this.setListHeight()
  },

  methods: {
    /**
   * 设置文章列表高度
   */
  setListHeight() {
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 98), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    this.setData({
      scrollHeight
    });
  },
  }

})