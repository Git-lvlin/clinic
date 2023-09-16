const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submsgSetting: {}, // 订阅消息配置
    user_mobile: '',
    oilcard_id: 0,
    oilcard_type: 1,
    oilcard_number: '',
    remark: '',

    sumbit_btn_name: '马上绑定',
    oilcard_type_items: [
      {
        value: 1,
        name: '中石化',
        checked: true,
      },
      {
        value: 2,
        name: '中石油',
      }
    ],
    tips: {
      '0' : '',
      '1' : '1、本卡由中国石油化工股份有限公司统一发行。 \n\
        2、持卡人需遵守“中国石化加油卡章程”的约定。 \n\
        3、本卡在联网的中国石化加油站具备“一卡在手，各地加油”的功能。 \n\
        4、本卡到期时，持卡人可在换卡截止日前到指定地点办理换卡手续，继续消费。\n\
          客户服务电话：95105888 95105988\n\
        ',
      '2' : '1 此卡由中国石油天然气股份有限公司发行，在所属指定加油站通用。\n\
            2 持卡人须按中国石油天然气股份有限公司有关规定及说明使用此卡。\n\
            3 此卡不记名，有效期最长三年，不积分，不挂失补办，请妥善保管。\n\
            4 他人拾获此卡，请送当地中国石油股份有限公司下属加油站。\n\
        ',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;

    if (options.oilcard_id > 0) {
      _this.setData({sumbit_btn_name: '确定修改', oilcard_id: options.oilcard_id})
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
      var oilcard_type_items = _this.data.oilcard_type_items
      oilcard_type_items.forEach(function(item, index) {
        if (item.value == options.oilcard_type) {
          oilcard_type_items[index].checked = true
        } else {
          oilcard_type_items[index].checked = false
        }
      })
      _this.setData({
        oilcard_type_items: oilcard_type_items,
      })
    } else {
      _this.getSetting();
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
    App._get('oilcard.Oilcard/setting', {}, (result) => {
      _this.setData({
        user_mobile: result.data.user_mobile,
        oilcard_type_items: result.data.oilcard_type_items,
      });
      if (result.data.tips) {
        _this.setData({
          tips: result.data.tips,
        });
      }
    });
  },

  changeOilcardType: function(e) {
    let _this = this
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    _this.setData({
      oilcard_type: e.detail.value
    });
  },

  /**
   * 提交
   */
  onFormSubmit(e) {
    let _this = this,
      values = e.detail.value
    // console.log(values)
    // 验证提现金额
    if (!values.oilcard_number || values.oilcard_number.length < 1) {
      App.showError('请填写油卡号码');
      return false;
    }
    // 按钮禁用
    _this.setData({
      disabled: true
    });

    values['oilcard_type'] = _this.data.oilcard_type;
    // console.log('JSON.stringify(values)', JSON.stringify(values))
    // 数据提交
    const onCallback = () => {
      App._post_form('oilcard.Oilcard/submit', values, (result) => {
        // 提交成功
        App.showError(result.msg, () => {
          wx.navigateBack({
            delta: 2
          })
        });
      }, null, () => {
        // 解除按钮禁用
        _this.setData({
          disabled: false
        });
      });
    };
    // 确认是否提交
    wx.showModal({
      title: '操作提示',
      content: '确定提交绑定吗？请确认填写无误',
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
    });
  },

  deleteOilcard: function(e) {
    let _this = this

    var oilcard_id = e.currentTarget.dataset.oilcard_id;

    // 按钮禁用
    _this.setData({
      deldisabled: true
    });

    // 数据提交
    const onCallback = () => {
      App._post_form('oilcard.Oilcard/delete', {oilcard_id: oilcard_id}, (result) => {
        // 提交成功
        App.showError(result.msg, () => {
          wx.navigateBack({
            delta: 2
          })
        });
      }, null, () => {
        // 解除按钮禁用
        _this.setData({
          deldisabled: false
        });
      });
    };
    // 确认是否提交
    wx.showModal({
      title: '操作提示',
      content: '删除之后不可恢复，确定删除绑定吗？',
      showCancel: true,
      success(res) {
        if (res.confirm) {
          onCallback()
        } else if (res.cancel) {
          // 解除按钮禁用
          _this.setData({
            deldisabled: false
          });
        }
      }
    });
  },
})
