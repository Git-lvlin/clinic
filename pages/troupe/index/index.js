const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isData: false,
    words: {},
    user: {},
    dealer: {},
    inviter:{},
    show: false,
    showRuleDetail: false,
      // 分享按钮组件
    share: {
      show: false,
      cancelWithMask: true,
      cancelText: '关闭',
      actions: [{
        name: '生成商品海报',
        className: 'action-class',
        loading: false
      }, {
        name: '发送给朋友',
        openType: 'share'
      }],
    },

    setInviteCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    // 获取分销商中心数据
    _this.getDealerCenter();
  },

  /**
   * 获取分销商中心数据
   */
  getDealerCenter() {
    let _this = this;
    App._get('user.troupe/center', {}, function(result) {
      let data = result.data;
      data.isData = true;
      // 设置当前页面标题
      wx.setNavigationBarTitle({
        title: data.words.index.title.value
      });
      _this.setData(data);
    });
  },
  copyInviteCode(){
    wx.setClipboardData({
      data:wx.getStorageSync('invite_code')
    })
  },
  setInvite(){
    this.setData({
      show:true,
      setInviteCode:''
    })
  },
  setInviteFalse(){
    this.setData({
      show:false
    })
  },
  setInviteTrue(){
    let _this=this;
    if(!/^[a-zA-Z0-9]{4,40}$/.test(_this.data.setInviteCode) ) {
      wx.showToast({
        title: '请输入正确的邀请码',
        icon:'none',
        duration: 1500
      })
      return;
    }
    App._post_form('user/setInvite', {
      invite_code: _this.data.setInviteCode,
    }, result => {
      _this.setData({
        show:false
      });
      wx.showToast({
        title: '补填邀请码成功',
        icon: 'success',
        duration: 2000
      })
      _this.getDealerCenter();
    }, false, () => {

    });
  },

  showRuleDetailClick() {
    this.setData({
      showRuleDetail: true
    })
  },
  showRuleDetailCancel() {
    this.setData({
      showRuleDetail: false
    })
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    const _this = this;
    // 构建页面参数
    const params = App.getShareUrlParams();
    console.log('onShareAppMessage params ', params)
    return {
      title: _this.data.basic.rule_title,
      path: "pages/troupe/index/index?" + params
    };
  },

  inputChange(e){
    this.setData({
      setInviteCode:e.detail.value
    })
  },
  /**
   * 跳转到提现页面
   */
  navigationToWithdraw() {
    wx.navigateTo({
      url: '../withdraw/apply/apply',
    })
  },
})
