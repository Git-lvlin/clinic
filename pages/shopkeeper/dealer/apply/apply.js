const App = getApp();
const Dialog = require('../../../../components/dialog/dialog');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_read: false,
    disabled: false,

    submsgSetting: {}, // 订阅消息配置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 获取订阅消息配置
    _this.getSubmsgSetting();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    // 获取分销商申请状态
    _this.getApplyState();
  },

  /**
   * 获取订阅消息配置
   */
  getSubmsgSetting() {
    let _this = this;
    App._get('wxapp.submsg/setting', {}, (result) => {
      _this.setData({
        submsgSetting: result.data.setting
      });
    });
  },

  /**
   * 获取分销商申请状态
   */
  getApplyState() {
    let _this = this;
    App._get('user.dealer/apply', {
      referee_id: _this.getRefereeid()
    }, (result) => {
      let data = result.data;
      // 当前是否已经为分销商
      if (data.is_dealer) {
        wx.redirectTo({
          url: '../index/index'
        });
      }
      // 设置当前页面标题
      wx.setNavigationBarTitle({
        title: data.words.apply.title.value
      });
      data.isData = true;
      _this.setData(data);
    });
  },

  /**
   * 显示申请协议
   */
  toggleApplyLicense() {
    Dialog({
      title: '申请协议',
      message: this.data.license,
      selector: '#zan-base-dialog',
      isScroll: true, // 滚动
      buttons: [{
        text: '我已阅读',
        color: 'red',
        type: 'cash'
      }]
    }).then(() => {
      // console.log('=== dialog resolve ===', 'type: confirm');
    });
  },

  /**
   * 已阅读
   */
  toggleSetRead() {
    let _this = this;
    _this.setData({
      is_read: !this.data.is_read
    });
  },

  /**
   * 提交申请 
   */
  onFormSubmit(e) {
    let _this = this,
      values = e.detail.value;

    // 验证姓名
    if (!values.name || values.name.length < 1) {
      App.showError('请填写姓名');
      return false;
    }

    // 验证手机号
    if (!/^\+?\d[\d -]{8,12}\d/.test(values.mobile)) {
      App.showError('手机号格式不正确');
      return false;
    }

    // 验证是否阅读协议
    if (!_this.data.is_read) {
      App.showError('请先阅读分销商申请协议');
      return false;
    }

    // 按钮禁用
    _this.setData({
      disabled: true
    });

    // 数据提交
    App._post_form('user.dealer.apply/submit', values, () => {
      // 获取分销商申请状态
      _this.getApplyState();
    }, null, () => {
      // 解除按钮禁用
      _this.setData({
        disabled: false
      });
    });
  },

  /**
   * 去商城逛逛
   */
  navigationToIndex(e) {
    // 跳转到首页
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 订阅消息通知
   */
  onSubMsg() {
    let _this = this;
    let tmplItem = _this.data.submsgSetting.dealer.apply.template_id;
    if (tmplItem.length > 0) {
      wx.requestSubscribeMessage({
        tmplIds: [tmplItem],
        success(res) {},
        fail(res) {},
        complete(res) {},
      });
    }
  },

  /**
   * 获取推荐人id
   */
  getRefereeid() {
    return wx.getStorageSync('referee_id');
  },

})