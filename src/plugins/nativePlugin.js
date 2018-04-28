/* eslint-disable no-undef */
/* eslint-disable camelcase */
import Toast from './cordova/android/toast'
/**
 * 显示原生列表
 *
 * @param {string} title 列表标题
 * @param {string} [options='[]'] 列表条目数组，JSON字符串对象
 * 格式为
 * [
 * {"oid":"alipay","oname":"支付宝","oimgurl":"pay_ali","selected": (payFunc=='alipay'?1:0) },
 * {"oid":"wxpay","oname":"微信","oimgurl":"pay_wx","selected": (payFunc=='wxpay'?1:0) }
 * ]
 * @param {Function} [successCallback=() => {}] 成功回调,返回oid
 * @param {Function} [failureCallback=() => {}] 失败回调
 * @param {string} [desc=''] 列表描述
 */
function showlist(
  title,
  options = '[]',
  successCallback = () => {},
  failureCallback = () => {},
  desc = ''
) {
  x_ui.showOptionPicker(successCallback, failureCallback, title, desc, options)
}
/**
 * 调用toast
 *
 * @param {String} msg 消息
 * @param {Function} [successFunc=() => {}] 成功回调
 * @param {Function} [errorFunc=() => {}] 失败回调
 */
function toast(msg, successFunc = () => {}, errorFunc = () => {}) {
  if (x_toast) {
    x_toast.showShortBottom(msg, successFunc, errorFunc)
  }
}
/**
 * 获取支持的支付方式
 *
 * @param {Function} [successFunc=() => {}] 成功回调，接受数组参数
 */
function getSupportPayments(successFunc = () => {}) {
  x_thirdparty.getPaymentSupportList(
    function(array) {
      if (array) {
        array = JSON.parse(array)
        successFunc(array)
      }
    },
    function() {
      toast('获取设备的支付方式失败')
    }
  )
}
/**
 * 调用第三方支付接口
 *
 * @param {string} payName 支付名 alipay/wxpay
 * @param {any} msg 支付信息[支付串]
 * @param {any} [successFunc=() => {}] 成功回调
 */
function pay(payName, msg, successFunc = () => {}) {
  x_thirdparty.doPayment(
    successFunc,
    function() {
      toast('支付失败')
    },
    payName.toUpperCase(),
    msg
  )
}
/**
 * 调用方法： 在main.js中引入，
 * Vue.use(NativeAPIPlugin, {
 * platform: true
 * })
 * 在页面方法中直接使用this.$camera
 */
let nativeAPIPlugin = {}
nativeAPIPlugin.install = function(Vue, options) {
  // true为cordova，false为H5，H5接口暂时留空
  let plat = options.platform
  Vue.prototype.$showlist = plat === true ? showlist : undefined
  Vue.prototype.$toast = plat === true ? toast : undefined
  Vue.prototype.$pay = plat === true ? pay : undefined
  Vue.prototype.$getSupportPayments =
    plat === true ? getSupportPayments : undefined
  Vue.prototype.$Toast = new Toast()
}
export default nativeAPIPlugin
