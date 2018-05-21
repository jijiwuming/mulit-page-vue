class BSScrollConfig {
  /**
   * @typedef {BSScrollConfigLike} BetterScroll配置类似对象
   * @property {function(Number,Number):Promise<{length}>} loadDataFunc 加载数据的函数
   * @property {Number} pageSize 页面大小
   * @property {boolean} loadFirstPage 是否自动加载首页，默认加载
   * @property {Number} probeType scroll事件派发设置:1-滚动时派发scroll事件，会截流。2 滚动时实时派发scroll事件，不截流。3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
   * @property {boolean} click 点击列表是否派发click事件
   * @property {boolean} scrollY 是否开启纵向滚动
   * @property {boolean} listenScroll 是否开启纵向滚动
   * @property {boolean} pullup 是否开启上拉加载
   * @property {Number} pullUpSize 上拉触发距离
   * @property {boolean} pulldown 是否开启下拉刷新
   * @property {Number} pullDownSize 下拉触发距离
   */
  /**
   * BetterScroll配置
   * @param {BSScrollConfigLike} [{
   *     loadDataFunc,
   *     pageSize = 10,
   *     loadFirstPage = true,
   *     probeType = 2,
   *     click = true,
   *     scrollY = true,
   *     listenScroll = true,
   *     pullup = true,
   *     pullUpSize = -50,
   *     pulldown = true,
   *     pullDownSize = 50
   *   }={}] 配置项
   * @memberof BSScrollConfig
   */
  constructor({
    loadDataFunc,
    pageSize = 10,
    loadFirstPage = true,
    probeType = 2,
    click = true,
    scrollY = true,
    listenScroll = true,
    pullup = true,
    pullUpSize = -50,
    pulldown = true,
    pullDownSize = 50
  } = {}) {
    this.loadDataFunc = loadDataFunc
    this.pageSize = pageSize
    this.loadFirstPage = loadFirstPage
    this.probeType = probeType
    this.click = click
    this.scrollY = scrollY
    this.listenScroll = listenScroll
    this.pullup = pullup
    this.pullUpSize = pullUpSize
    this.pulldown = pulldown
    this.pullDownSize = pullDownSize
  }
}
export { BSScrollConfig }
