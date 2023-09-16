const App = getApp();

/**
 * 仓库扩展类
 */
module.exports = {

  /**
   * 获取仓库设置
   */
  getSetting(callback) {
    App._get('warehouse.setting/getAll', {}, function(result) {
      callback(result.data.setting);
    });
  },

};
