import Vue from 'vue'
import Toast from './cordova/android/toast'
declare module 'vue/types/vue' {
  interface Vue {
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
     * @memberof Vue
     */
    $showlist(
      title: string,
      options?: string,
      successCallback?: Function,
      failureCallback?: Function,
      desc?: string
    ): void
    /**
     * 调用toast
     *
     * @param {String} msg 消息
     * @param {Function} [successFunc=() => {}] 成功回调
     * @param {Function} [errorFunc=() => {}] 失败回调
     * @memberof Vue
     */
    $toast(msg: string, successFunc: Function, errorFunc: Function): void
    /**
     * 获取支持的支付方式
     *
     * @param {Function} [successFunc=() => {}] 成功回调，接受数组参数
     * @memberof Vue
     */
    $getSupportPayments(successFunc: Function): void
    /**
     * 调用第三方支付接口
     *
     * @param {string} payName 支付名 alipay/wxpay
     * @param {any} msg 支付信息[支付串]
     * @param {any} [successFunc=() => {}] 成功回调
     * @memberof Vue
     */
    $pay(payName: string, msg: string, successFunc: Function): void
    $Toast: Toast
  }
}
