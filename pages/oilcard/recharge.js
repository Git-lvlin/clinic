const App = getApp();

// 枚举类：支付方式
import PayTypeEnum from '../../utils/enum/order/PayType'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_mobile: '',
    oilcard_id: 0,
    oilcard_type: 1,
    oilcard_number: '',
    remark: '',
    money: '',
    tips: 'abcd',

    sumbit_btn_name: '提交订单',
    recharge_items: [
      200,
      500,
      1000,
      3000,
    ],

    // 禁用submit按钮
    disabled: false,

    // 支付方式
    PayTypeEnum,
    curPayType: PayTypeEnum.WECHAT.value,
    
    // 是否使用积分抵扣
    isUsePoints: false,
    
    order_id: null,
    order: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;

    _this.getSetting();
    if (options.oilcard_id > 0) {
      _this.setData({sumbit_btn_name: '提交订单', oilcard_id: options.oilcard_id})
      if (options.oilcard_type > 0) {
        _this.setData({
          oilcard_type: options.oilcard_type,
        })
      }
      if (options.oilcard_number) {
        _this.setData({
          oilcard_number: options.oilcard_number,
        })
      }
      if (options.remark) {
        _this.setData({
          remark: options.remark,
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
  },

  /**
   * 获取配置
   */
  getSetting() {
    let _this = this
    App._get('oilcard.RechargeOrder/setting', {}, (result) => {
      _this.setData({
        user_mobile: result.data.user_mobile,
        recharge_items: result.data.recharge_items,
      });
      if (result.data.tips) {
        _this.setData({
          tips: result.data.tips,
        });
      }
    });
  },

  changeMoney: function(e) {
    let _this = this
    let recharge_amount = e.currentTarget.dataset.recharge_amount;
    if (recharge_amount) {
      _this.setData({
        money: recharge_amount
      });
    } else {
      _this.setData({
        money: ''
      });
      
    }
  },

  inputMoney: function(e) {
    let _this = this

    console.log('input发生change事件，携带value值为：', e.detail.value, ' e.detail ', e.detail, ' | e', e, ' this ', this)
    _this.setData({
      money: e.detail.value
    });
  },

  /**
   * 选择支付方式
   */
  onSelectPayType(e) {
    let _this = this;
    // 设置当前支付方式
    _this.setData({
      curPayType: e.currentTarget.dataset.value
    });
  },

  /**
   * 提交
   */
  onFormSubmit(e) {
    let _this = this,
      values = e.detail.value

    if (_this.data.disabled) {
      return false;
    }

    if (!(values.oilcard_id > 0)) {
      wx.showModal({
        title: '操作提示',
        content: '请选择需要充值的油卡',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 2
            })
          } else if (res.cancel) {
            // 解除按钮禁用
            _this.setData({
              disabled: false
            });
          }
        }
      })
      return false;
    }

    values['money'] = _this.data.money;
    if (!(values['money'] > 0)) {
      App.showError('请选择需要充值的金额');
      return false;
    }
    values['pay_type'] = _this.data.curPayType
    // 按钮禁用
    _this.setData({
      disabled: true
    })
    // console.log('JSON.stringify(values)', JSON.stringify(values))
    // 数据提交
    const onCallback = () => {
      App._post_form('oilcard.RechargeOrder/submit', values, (result) => {
        _this._onSubmitCallback(result);
      }, null, () => {
        wx.hideLoading();
        // 解除按钮禁用
        _this.setData({
          disabled: false
        });
      });
    };
    // 确认是否提交
    wx.showModal({
      title: '操作提示',
      content: '确定提交订单吗？请确认填写无误',
      showCancel: true,
      success(res) {
        if (res.confirm) {
          onCallback()
        } else if (res.cancel) {
          // 解除按钮禁用
          _this.setData({
            disabled: false
          });
        }
      }
    })
  },

  /**
   * 订单提交成功后回调
   */
  _onSubmitCallback(result) {
    console.log('_onSubmitCallback ', result)
    let _this = this;
    // 订单创建成功后回调--微信支付
    if (result.code === -10) {
      App.showError(result.msg, () => {
        _this.redirectToOrderIndex();
      });
      return false;
    }
    // 发起微信支付
    if (result.data.pay_type == PayTypeEnum.WECHAT.value) {
      App.wxPayment({
        payment: result.data.payment,
        success: res => {
          _this.redirectToOrderIndex();
        },
        fail: res => {
          App.showError(result.msg.error, () => {
            _this.redirectToOrderIndex();
          });
        },
      });
    }
    // 余额支付
    if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
      App.showSuccess(result.msg.success, () => {
        _this.redirectToOrderIndex();
      });
    }
  },

  /**
   * 跳转到未付款订单
   */
  redirectToOrderIndex() {
    wx.redirectTo({
      url: './recharge_order',
    });
  },

})
