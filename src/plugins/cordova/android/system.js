export default class System {
  constructor() {
    if (window.x_system) {
      console.log('SystemPluginReady')
    } else {
      return Object.create(null)
    }
  }
  /**
   * 获取设备信息
   *
   * @param {function(string)} successCallback 成功回调
   * 传入参数为 设备信息(string类型) {"cid":"xxxx","imei":"","ver":""}
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  getDeviceInfo(successCallback, errorCallback) {
    window.x_system.getDeviceInfo(successCallback, errorCallback)
  }
  /**
   * 获取系统版本号
   *
   * @param {function(string)} successCallback 成功回调
   * 传入参数为 系统版本号(string类型) ，如 "1.0" 或 "3.4b5".
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  getOSVersion(successCallback, errorCallback) {
    window.x_system.getOSVersion(successCallback, errorCallback)
  }
  /**
   * 获取网络接入方式.
   *
   * @param {function(number)} successCallback 成功回调
   * 传入参数为 网络接入方式（0:未知, 1:手机网络，2:无线WIFI）
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  getNetworkType(successCallback, errorCallback) {
    window.x_system.getNetworkType(successCallback, errorCallback)
  }
  /**
   * 获取个推的PushCID
   *
   * @param {function(number)} successCallback 成功回调
   * 传入参数为 个推pushcid
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  getPushCID(successCallback, errorCallback) {
    window.x_system.getPushCID(successCallback, errorCallback)
  }
  /**
   * 清空缓存
   *
   * @param {Function} successCallback 成功回调
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  cleanCache(successCallback, errorCallback) {
    window.x_system.cleanCache(successCallback, errorCallback)
  }
  /**
   * 弹出照片选择器
   *
   * @param {number} maxSelec 最大选择数量
   * @param {number} width 宽度
   * @param {number} height 高度
   * @param {function(string[])} successCallback 成功回调
   * 传入参数为 照片的地址路径数组（文件路径数据  ["file://xxx/xx.png","file://xxx/xxx.png"]）
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  photoPicker(maxSelec, width, height, successCallback, errorCallback) {
    window.x_system.photoPicker(
      successCallback,
      errorCallback,
      maxSelec,
      width,
      height
    )
  }
  /**
   * 弹出省份与城市选择器
   *
   * @param {string} selectcode 选择的城市邮编
   * @param {function(JSON)} successCallback 成功回调
   * 传入参数为 省份与城市 (数据结构  {"pname":"省份","cname":"城市","aname":"城区","acode":"邮编"})
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  addressPicker(selectcode, successCallback, errorCallback) {
    window.x_system.addressPicker(successCallback, errorCallback, selectcode)
  }
  /**
   * 调高屏幕亮度
   *
   * @param {Function} successCallback 成功回调
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  improveBrightness(successCallback, errorCallback) {
    window.x_system.improveBrightness(successCallback, errorCallback)
  }
  /**
   * 恢复屏幕亮度
   *
   * @param {Function} successCallback 成功回调
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  resetBrightness(successCallback, errorCallback) {
    window.x_system.resetBrightness(successCallback, errorCallback)
  }
  /**
   * 自动设置屏幕亮度
   *
   * @param {boolean} auto 是否自动设置
   * @param {Function} successCallback 成功回调
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  setAutoBrightness(auto, successCallback, errorCallback) {
    window.x_system.setAutoBrightness(successCallback, errorCallback, auto)
  }
  /**
   * 设置屏幕亮度
   *
   * @param {number} brightness 亮度值 ，暗到全亮(0-255)
   * @param {Function} successCallback 成功回调
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  setWindowsBrightness(brightness, successCallback, errorCallback) {
    window.x_system.setWindowsBrightness(
      successCallback,
      errorCallback,
      brightness
    )
  }
  /**
   * 获取屏幕亮度值
   *
   * @param {function(number)} successCallback 成功回调
   * 传入参数为 亮度值 ，暗到全亮(0-255)
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  getWindowsBrightness(successCallback, errorCallback) {
    window.x_system.getWindowsBrightness(successCallback, errorCallback)
  }
  /**
   * 判断是否开启自动亮度
   *
   * @param {Function} successCallback 成功回调
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  isAutoBrightness(successCallback, errorCallback) {
    window.x_system.isAutoBrightness(successCallback, errorCallback)
  }
  /**
   * 注册Push监听事件
   *
   * @param {string} messageId 需要监听的message事件id
   * @param {Function} callback push消息回调方法名称
   * @param {Function} successCallback 成功回调
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  registerPushListener(messageId, callback, successCallback, errorCallback) {
    window.x_system.registerPushListener(
      successCallback,
      errorCallback,
      messageId,
      callback
    )
  }
  /**
   * 取消Push监听事件
   *
   * @param {string} messageId  监听的message事件id
   * @param {Function} successCallback 成功回调
   * @param {Function} errorCallback 失败回调
   * @memberof System
   */
  unRegisterPushListener(messageId, successCallback, errorCallback) {
    window.x_system.unRegisterPushListener(
      successCallback,
      errorCallback,
      messageId
    )
  }
}
