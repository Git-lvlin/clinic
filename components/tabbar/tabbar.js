// components/tabbar/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'apply-shared'
  },

  properties: {

  },

  
  /**
   * 组件的初始数据
   */
  data: {
    theme: '',
    activeIndex: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    themeChanged(theme) {
      this.setData({
        theme,
      });
    },

    tabChange(e){
      let index = e.currentTarget.dataset.index;
      switch(String(index)){
        case '0':
          wx.redirectTo({
            url: 'url',
          })({
            url: '/pages/warehouse/index/index',
          })
        break;

        case '1':
          wx.redirectTo({
            url: '/pages/warehouse/flow/index',
          })
        break;

        case '2':
          wx.redirectTo({
            url: '/pages/warehouse/order/index',
          })
        break;
      }
      this.setData({
        activeIndex: e.currentTarget.dataset.index|| 0
      })
    },
  }
})