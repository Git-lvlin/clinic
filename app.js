/**
 * tabBar页面路径列表 (用于链接跳转时判断)
 * tabBarLinks为常量, 无需修改
 */
 const tabBarLinks = [
 'pages/index/index',
 'pages/category/list',
 'pages/flow/index',
 'pages/user/index',
 'pages/sharing/index/index'
 ];

// 站点配置文件
import siteinfo from './siteinfo.js';

// 工具类
import util from './utils/util.js';

App({

  /**
   * 全局变量
   */
  globalData: {
    user_id: null,
    code: '',
    openid: '',
    session_key: '',
    mobile_acquired: false,
    storeList: [],
    storeInfo: {},
    shop_id: '',
    storeInfo: {},
    role: 0, // 0 用户 1店主 2 店员 3仓库,
    coordinate: {
      longitude: '113.75179',
      latitude: '23.02067'
    },
    shopInfo: {}, // 某个水店的信息，在退桶时选择完门店并显示门店
    leastOrderQuantity: 1, //水店最小起订量
  },

  // api地址
  api_root: siteinfo.siteroot + 'index.php?s=/api/',

  /**
   * 生命周期函数--监听小程序初始化
   */
   onLaunch(e) {
    let _this = this;
    // 小程序主动更新
    _this.updateManager();
    // 小程序启动场景
    _this.onStartupScene(e.query);

    wx.login({
      success: resp0 => {
        _this._wxLoginSuccess(resp0)
      }
    });

    _this.globalData.role = wx.getStorageSync('role') || 0;
  },

  _wxLoginSuccess(resp0) {
    let _this = this;
    // 微信
    if (resp0.code) {
      //发起网络请求
      // 发送 resp0.code 到后台换取 openId, sessionKey, unionId
      this.globalData.code = resp0.code
      //登陆成功并成功返回code便发起网络请求获得OPENID
      wx.request({
        url: _this.api_root + 'wxapp.Openid/get',
        data: {
          code: resp0.code,
          wxapp_id: _this.getWxappId(),
          referee_id: _this.getRefereeid(),
          invite_code: _this.getOtherInviteCode()
        },
        success: function (resp1) {
          var res = resp1.data
          // 后台PHP 的 code = 1 表示成功
          if (res && res.code == 1) {
            console.log(res.data.openid)
            _this.globalData.openid = res.data.openid
            _this.globalData.session_key = res.data.session_key
            _this.globalData.mobile_acquired = res.data.mobile_acquired
            _this.globalData.userinfo_acquired = res.data.userinfo_acquired
            //_this.checkMobileAcquired();
            if (_this.checkMobileAcquired() && _this.checkUserinfoAcquired() && res.data.token) {
              // 记录token user_id
              wx.setStorageSync('token', res.data.token);
            }
            if (_this.checkMobileAcquired() && _this.checkUserinfoAcquired() && res.data.user_id) {
              // 记录token user_id
              wx.setStorageSync('user_id', res.data.user_id);
              _this.saveMyInviteCode(res.data.invite_code)
            }
            if (!_this.checkIsLogin() && wx.getStorageSync('referee_id')) {
              wx.setStorageSync('referee_id_Login', 1)
              wx.reLaunch({
                url: '/pages/invite/index',
              })
            }
            let newUser = _this.getRefereeid() || _this.getMyInviteCode() ? true : false;
            if (_this.globalData.mobile_acquired && !_this.globalData.userinfo_acquired && newUser) {
              wx.setStorageSync('referee_id_Login', 2)
              wx.reLaunch({
                url: '/pages/inviteAffirm/index',
              })
            }
          } else {}
        }
      })
    } else {
      console.error('获取openid失败' + res.errMsg)
    }
  },

  /**
   * 小程序启动场景
   */
   onStartupScene(query) {
    // 获取场景值
    let scene = this.getSceneData(query);
    // 记录推荐人id
    let refereeId = query.referee_id ? query.referee_id : scene.uid;
    refereeId > 0 && (this.saveRefereeId(refereeId));

    let invite_code_others = query.invite_code ? query.invite_code : scene.invite_code
    this.saveOtherInviteCode(invite_code_others)
  },

  /**
   * 获取商城ID
   */
   getWxappId() {
    return siteinfo.uniacid || 10001;
  },

  /**
   * 记录推荐人id
   */
  saveRefereeId(refereeId) {
    let App = this;
    refereeId = parseInt(refereeId);
    if (refereeId <= 0 || refereeId == App.getUserId()) {
      return false;
    }
    if (wx.getStorageSync('referee_id')) {
      return false;
    }
    wx.setStorageSync('referee_id', refereeId);
    return true;
  },

  saveMyInviteCode(invite_code) {
    wx.setStorageSync('invite_code', invite_code)
    return true;
  },
  
  getMyInviteCode() {
    return wx.getStorageSync('invite_code')
  },

  saveOtherInviteCode(invite_code) {
    if (wx.getStorageSync('invite_code_others')) {
      return false;
    }
    wx.setStorageSync('invite_code_others', invite_code)
    return true;
  },
  
  getOtherInviteCode() {
    return wx.getStorageSync('invite_code_others')
  },

  /**
   * 获取场景值(scene)
   */
   getSceneData(query) {
    return query.scene ? util.scene_decode(query.scene) : {};
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
   onShow(options) {
    //let App = this;
    //App.globalData.role = Number(wx.getStorageSync('role') || 0)
    /*try {
      const livePlayer = requirePlugin('live-player-plugin');
      if (options.scene == 1007 || options.scene == 1008 || options.scene == 1044) {
        livePlayer.getShareParams()
          .then(res => {
            // 直播页面的自定义参数
            let customParams = res.custom_params;
            console.log('get custom params', customParams);
            // 记录推荐人ID
            if (customParams.hasOwnProperty('referee_id')) {
              App.saveRefereeId(customParams['referee_id']);
            }
            if (customParams.hasOwnProperty('invite_code')) {
              App.saveOtherInviteCode(customParams['invite_code'])
            }
          }).catch(err => {
            console.log('get share params', err)
          });
      }
    } catch (error) {

    }*/
  },

  /**
   * 执行用户登录
   */
   doLogin(delta) {
    // 保存当前页面
    let pages = getCurrentPages();
    if (pages.length) {
      let currentPage = pages[pages.length - 1];
      "pages/login/login" != currentPage.route &&
      wx.setStorageSync("currentPage", currentPage);
    }
    // 跳转授权页面
    wx.navigateTo({
      url: "/pages/login/login?delta=" + (delta || 1)
    });
  },

  doLogout(goto) {
    if (!goto) {
      goto = '/pages/index/index'
    }
    wx.setStorageSync('token', '');
    wx.setStorageSync('user_id', '');
    wx.removeStorageSync('invite_code');
    wx.setStorageSync('role', 0);

    wx.switchTab({
      url: goto
    });
  },

  /**
   * 当前用户id
   */
   getUserId() {
    return wx.getStorageSync('user_id');
  },

  /**
   * 显示成功提示框
   */
   showSuccess(msg, callback) {
    wx.showToast({
      title: msg,
      icon: 'success',
      mask: true,
      duration: 1500,
      success() {
        callback && (setTimeout(() => {
          callback();
        }, 1500));
      }
    });
  },

  /**
   * 显示失败提示框
   */
   showError(msg, callback) {
    wx.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success(res) {
        callback && callback();
      }
    });
  },

  /**
   * get请求
   */
   _get(url, data, success, fail, complete, check_login) {
    wx.showNavigationBarLoading();
    let _this = this;
    // 构造请求参数
    data = data || {};
    data.wxapp_id = _this.getWxappId();

    // if (typeof check_login === 'undefined')
    //   check_login = true;

    // 构造get请求
    let request = () => {
      data.token = wx.getStorageSync('token');
      wx.request({
        url: _this.api_root + url,
        header: {
          'content-type': 'application/json'
        },
        data: data,
        success(res) {
          if (res.statusCode !== 200 || typeof res.data !== 'object') {
            _this.showError('网络请求出错');
            return false;
          }
          if (res.data.code === -1) {
            // 登录态失效, 重新登录
            wx.hideNavigationBarLoading();
            _this.doLogin(2);
          } else if (res.data.code === 0) {
            _this.showError(res.data.msg, () => {
              fail && fail(res);
            });
            return false;
          } else {
            success && success(res.data);
          }
        },
        fail(res) {
          _this.showError(res.errMsg, () => {
            fail && fail(res);
          });
        },
        complete(res) {
          wx.hideNavigationBarLoading();
          complete && complete(res);
        },
      });
    };
    // 判断是否需要验证登录
    check_login ? _this.doLogin(request) : request();
  },

  /**
   * post提交
   */
   _post_form(url, data, success, fail, complete, isShowNavBarLoading) {
    let _this = this;

    isShowNavBarLoading || true;
    data.wxapp_id = _this.getWxappId();
    data.token = wx.getStorageSync('token');

    // 在当前页面显示导航条加载动画
    if (isShowNavBarLoading == true) {
      wx.showNavigationBarLoading();
    }
    wx.request({
      url: _this.api_root + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      data: data,
      success(res) {
        if (res.statusCode !== 200 || typeof res.data !== 'object') {
          _this.showError('网络请求出错');
          return false;
        }
        if (res.data.code === -1) {
          // 登录态失效, 重新登录
          wx.hideNavigationBarLoading();
          _this.doLogin(1);
          return false;
        } else if (res.data.code === 0) {
          _this.showError(res.data.msg, () => {
            fail && fail(res);
          });
          return false;
        }
        success && success(res.data);
      },
      fail(res) {
        // console.log(res);
        _this.showError(res.errMsg, () => {
          fail && fail(res);
        });
      },
      complete(res) {
        wx.hideNavigationBarLoading();
        // wx.hideLoading();
        complete && complete(res);
      }
    });
  },

  /**
   * 验证是否存在user_info
   */
   validateUserInfo() {
    let user_info = wx.getStorageSync('user_info');
    return !!wx.getStorageSync('user_info');
  },

  /**
   * 小程序主动更新
   */
   updateManager() {
    if (!wx.canIUse('getUpdateManager')) {
      return false;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(res => {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    });
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，即将重启应用',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      });
    });
    updateManager.onUpdateFailed(() => {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    });
  },

  /**
   * 获取tabBar页面路径列表
   */
   getTabBarLinks() {
    return tabBarLinks;
  },

  /**
   * 跳转到指定页面
   * 支持tabBar页面
   */
  navigationTo(url) {
    if (!url || url.length == 0) {
      return false;
    }
    let tabBarLinks = this.getTabBarLinks();
    // tabBar页面
    if (tabBarLinks.indexOf(url) > -1) {
      wx.switchTab({
        url: '/' + url
      });
    } else {
      // 普通页面
      wx.navigateTo({
        url: '/' + url
      });
    }
  },

  /**
   * 记录formId
   * (因微信模板消息已下线，所以formId取消不再收集)
   */
   saveFormId(formId) {
    return true;
    // let _this = this;
    // console.log('saveFormId');
    // if (formId === 'the formId is a mock one') {
    //   return false;
    // }
    // _this._post_form('wxapp.formId/save', {
    //   formId: formId
    // }, null, null, null, false);
  },

  /**
   * 生成转发的url参数
   */
   getShareUrlParams(params) {
    let _this = this;
    return util.urlEncode(Object.assign({
      referee_id: _this.getUserId(),
      invite_code: _this.getMyInviteCode()
    }, params));
  },

  /**
   * 发起微信支付
   */
   wxPayment(option) {
    let options = Object.assign({
      payment: {},
      success: () => {},
      fail: () => {},
      complete: () => {},
    }, option);
    wx.requestPayment({
      timeStamp: options.payment.timeStamp,
      nonceStr: options.payment.nonceStr,
      package: 'prepay_id=' + options.payment.prepay_id,
      signType: 'MD5',
      paySign: options.payment.paySign,
      success(res) {
        options.success(res);
      },
      fail(res) {
        options.fail(res);
      },
      complete(res) {
        options.complete(res);
      }
    });
  },

  /**
   * 验证登录
   */
   checkIsLogin() {
    return wx.getStorageSync('token') != '' && wx.getStorageSync('user_id') != '';
  },

  /**
   * 解密手机号码
   */
   getPhoneNumber(e, callback) {
    let _this = this;

    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      return;
    }
    if (!_this.globalData.session_key) {
      wx.login({
        success: resp0 => {
          _this._wxLoginSuccess(resp0)
        }
      });
    }
    if (!_this.globalData.session_key) {
      return;
    }
    wx.request({
      url: _this.api_root + 'wxapp.Openid/save',
      data: {
        wxapp_id: _this.getWxappId(),
        ciphertext: e.detail.encryptedData,
        iv: e.detail.iv,
        skey: _this.globalData.session_key,
        openid: _this.globalData.openid,
        referee_id: _this.getRefereeid(),
        invite_code: _this.getOtherInviteCode()
      },
      method: "post",
      success: function (resp) {
        var result = resp.data
        // 后台PHP 的 code = 1 表示成功
        if (result && result.code == 1) {
          _this.globalData.mobile_acquired = true
          // 记录token user_id
          if (result.data.userinfo_acquired) {
            wx.setStorageSync('token', result.data.token);
            wx.setStorageSync('user_id', result.data.user_id);
            wx.setStorageSync('invite_code', result.data.invite_code);
          }
          // 执行回调函数
          callback && callback(result);
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none',
            duration: 1500
          })
        }
      }
    });
  },

  /**
   * 授权登录
   */
   getUserInfo(info, callback) {
    let App = this;
    wx.showLoading({
      title: "正在登录",
      mask: true
    });
    // 执行微信登录
    wx.login({
      success(res) {
        // 发送用户信息
        let queryStr = "&wxapp_id=" + App.getWxappId()
        App._post_form('user/login' + queryStr, {
          code: res.code,
          encrypted_data: info.encryptedData,
          iv: info.iv,
          signature: info.signature,
          user_info: JSON.stringify(info.userInfo),
          referee_id: App.getRefereeid()
        }, result => {
          // 记录token user_id
          wx.setStorageSync('token', result.data.token);
          wx.setStorageSync('user_id', result.data.user_id);
          wx.setStorageSync('invite_code', result.data.invite_code);
          //wx.setStorageSync('shop_list', result.data.shop_list);
          // 执行回调函数
          callback && callback();
        }, false, () => {
          wx.hideLoading();
        });
      }
    });
  },

  /**
   * 获取推荐人id
   */
   getRefereeid() {
    return wx.getStorageSync('referee_id');
  },

  // 检查手机号码是否已经获取
  checkMobileAcquired() {
    // console.log('this.globalData.mobile_acquired ', this.globalData.mobile_acquired)
    return this.globalData.mobile_acquired;
  },

  // 检查手机号码是否已经获取
  checkUserinfoAcquired() {
    // console.log('this.globalData.userinfo_acquired ', this.globalData.userinfo_acquired)
    return this.globalData.userinfo_acquired;
  },

  /**
   * 记录购物车商品总数量
   * @param {*} value
   */
   setCartTotalNum(value, label) {
    wx.setStorageSync(label || 'cartTotalNum', Number(value))
  },

  /**
   * 设置购物车tabbar的角标
   */
   setCartTabBadge() {
    const number = wx.getStorageSync('cartTotalNum')
    if (number > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: `${number}`
      })
    } else {
      wx.removeTabBarBadge({
        index: 2
      })
    }
    return
  },

});