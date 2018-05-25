<template>
  <div class="better-scroll-list-wrapper" ref="betterScrollListWrapper">
    <div class="better-scroll-list-content">
      <div v-show="showPullDownTip">
        <div class="better-scroll-list-pull-down">
          <template v-if="pullDownState === 1">
            <slot name="pull-down-stage1">下拉刷新</slot>
          </template>
          <template v-else-if="pullDownState === 2">
            <slot name="pull-down-stage2">释放刷新</slot>
          </template>
          <template v-else-if="pullDownState === 3">
            <slot name="pull-down-stage3">刷新中...</slot>
          </template>
        </div>
      </div>
      <div class="better-scroll-data-list-wrapper">
        <slot></slot>
      </div>
      <div v-show="showPullUpTip">
        <div class="better-scroll-list-pull-up">
          <template v-if="pullUpState === 1">
            <slot name="pull-up-stage1">加载中</slot>
          </template>
          <template v-else-if="customShowAllLoadedTip && pullUpState === 2">
            <slot name="pull-up-stage2">已加载全部</slot>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import { BSScrollConfig } from './better-scroll-config.js'
export default {
  props: {
    // 配置项
    config: {
      type: BSScrollConfig,
      required: true
    },
    // 列表的数据
    data: {
      type: Array,
      default: null
    }
  },
  mounted: function() {
    let self = this
    self.initBsScroll()
    window.onbeforeunload = e => {
      self.$destroy()
    }
    // 获取父窗口高度
    /*
    self.windowHeight = parseFloat(
      window.getComputedStyle(self.$refs.betterScrollListWrapper).height
    )
    */
  },
  beforeDestroy() {
    this.destroy()
  },
  computed: {
    // 客制化全加载提示文本的显示
    customShowAllLoadedTip: function() {
      if (this.config.showAllLoaded < 0) {
        return false
      } else {
        return this.allcount >= this.config.showAllLoaded ? true : false
      }
    }
  },
  data() {
    return {
      bsscroll: null,
      // 父窗口高度
      // windowHeight: 0,
      // 上拉中
      pullUpLoad: false,
      // 上拉的状态阶段,0-无，1-上拉刷新，2-松开刷新，3-加载中
      pullUpState: 1,
      showPullUpTip: false,
      // 下拉中
      pullDownLoad: false,
      // 下拉的状态阶段,0-无，1-下拉刷新，2-松开刷新，3-加载中
      pullDownState: 1,
      showPullDownTip: false,
      // 全部的数据量
      allcount: 0
    }
  },
  methods: {
    // 创建实例
    initBsScroll() {
      let self = this
      if (!self.$refs.betterScrollListWrapper) {
        return
      }
      // 配置BScroll参数
      self.bsscroll = new BScroll(self.$refs.betterScrollListWrapper, {
        probeType: self.config.probeType,
        click: self.config.click,
        scrollY: self.config.scrollY,
        pullDownRefresh: {
          threshold: self.config.pullDownSize,
          stop: 0
        },
        pullUpLoad: {
          threshold: self.config.pullUpSize
        }
      })
      // TODO: 此处为便于观察设置，后续去除
      window.bsscroll = self.bsscroll
      // 是否派发滚动事件
      if (self.config.listenScroll) {
        self.bsscroll.on('scroll', pos => {
          if (self.config.pulldown) {
            let oldState = self.pullDownState
            if (pos.y > 0) self.showPullDownTip = true
            if (oldState < 3) {
              if (pos.y > 0 && pos.y < self.config.pullDownSize) {
                self.pullDownState = 1
              }
              if (pos.y >= self.config.pullDownSize) {
                self.pullDownState = 2
              }
            }
          }
          // 重置下拉的显示
          if (pos.y <= 0) {
            self.pullDownState = 1
            self.showPullDownTip = false
          }
          self.$emit('scroll', pos)
        })
      }
      // 配置首次加载数据
      if (self.config.loadFirstPage) {
        // 派发首页加载事件
        setTimeout(function() {
          self.$emit('loadFirstPage', self.PromiseLoadFirstPage())
        }, self.config.loadReadyTime)
      }
      // 是否派发滚动到底部事件，用于上拉加载
      if (self.config.pullup) {
        self.bsscroll.on('pullingUp', () => {
          self
            .PromisePullUp()
            .then(() => {
              // 调用上拉加载
            })
            .catch(err => {
              console.dir(err)
            })
        })
      } else {
        self.bsscroll && self.bsscroll.closePullUp()
      }
      // 是否派发顶部下拉事件，用于下拉刷新
      if (self.config.pulldown) {
        self.bsscroll.on('pullingDown', () => {
          self
            .PromisePullDown()
            .then(() => {
              // 调用下拉刷新
            })
            .catch(err => {
              console.dir(err)
            })
        })
      } else {
        self.bsscroll && self.bsscroll.closePullDown()
      }
    },
    // 承诺首页加载
    PromiseLoadFirstPage() {
      let self = this
      if (self.config.pulldown && self.config.programTipLoad) {
        // 下拉加载首页
        return self.reloadPullDown()
      } else if (self.config.pullup && self.config.programTipLoad) {
        // 上拉加载首页
        return self.loadPullUp()
      } else {
        // 无显示tip加载
        return self.config.loadDataFunc(1, self.config.pageSize).finally(() => {
          self.refresh()
        })
      }
    },
    // 承诺下拉刷新
    PromisePullDown() {
      let self = this
      return new Promise((resolve, reject) => {
        if (self.config.pulldown) {
          if (!self.pullDownLoad) {
            // 关闭上拉
            self.closePullUp()
            // 下拉动作
            self.pullDownLoad = true
            self.pullDownState = 3
            self.config
              .loadDataFunc(1, self.config.pageSize)
              .finally(() => {
                self.endPullDownload()
              })
              .then(({ length }) => {
                self.allcount = length ? length : 0
                if (length && self.allcount <= self.data.length) {
                  // 上拉数据显示
                  self.showPullUpTip = true
                  self.pullUpState = 2
                } else {
                  // 消除上拉的区域样式
                  self.showPullUpTip = false
                  self.pullUpState = 1
                }
              })
            resolve()
          } else {
            self.bsscroll.finishPullDown()
          }
        }
        reject()
      })
    },
    // 承诺上拉加载
    PromisePullUp() {
      let self = this
      return new Promise((resolve, reject) => {
        if (self.config.pullup) {
          if (!self.pullUpLoad && self.pullUpState < 2) {
            // 关闭下拉
            self.closePullDown()
            // 上拉动作
            self.pullUpLoad = true
            self.showPullUpTip = true
            let pageIndex =
              Math.floor(self.data.length / self.config.pageSize) + 1
            self.config
              .loadDataFunc(pageIndex, self.config.pageSize)
              .finally(() => {
                self.endPullUpload()
              })
              .then(({ length }) => {
                self.allcount = length ? length : 0
                // 超过数量时
                if (length && self.allcount <= self.data.length) {
                  self.pullUpState = 2
                  self.showPullUpTip = true
                }
              })
            resolve()
          } else {
            self.bsscroll.finishPullUp()
          }
        }
        reject()
      })
    },
    // 下拉刷新方法
    reloadPullDown() {
      let self = this
      if (self.config.pulldown) {
        if (self.config.programTipLoad) {
          self.scrollTo(
            0,
            self.config.pullDownSize + 1,
            self.config.loadReadyTime,
            'swipe'
          )
        }
        // 使得代码调用时一直显示加载中
        setTimeout(() => {
          self.pullDownState = 3
        }, 0)
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            self
              .PromisePullDown()
              .then(() => {
                resolve()
              })
              .catch(err => {
                reject(err)
              })
          }, self.config.loadReadyTime)
        })
      } else {
        return Promise.reject('设置不允许下拉')
      }
    },
    // 上拉加载方法
    loadPullUp() {
      let self = this
      if (self.config.pullup) {
        if (self.config.programTipLoad) {
          self.scrollTo(
            0,
            self.bsscroll.maxScrollY + self.config.pullUpSize - 1,
            self.config.loadReadyTime,
            'swipe'
          )
        }
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            self
              .PromisePullUp()
              .then(() => {
                resolve()
              })
              .catch(err => {
                reject(err)
              })
          }, self.config.loadReadyTime)
        })
      } else {
        return Promise.reject('设置不允许上拉')
      }
    },
    // 结束上拉
    endPullUpload() {
      let self = this
      // 开启下拉
      self.openPullDown()
      // 结束上拉动作
      self.showPullUpTip = false
      self.bsscroll.finishPullUp()
      self.refresh()
      self.pullUpLoad = false
    },
    // 结束下拉
    endPullDownload() {
      let self = this
      // 开启上拉
      self.openPullUp()
      // 结束下拉动作
      self.showPullDownTip = false
      self.showPullUpTip = false
      self.bsscroll.finishPullDown()
      self.refresh()
      self.pullDownLoad = false
    },
    // 关闭上拉
    closePullUp() {
      let self = this
      self.config.pullup && self.bsscroll && self.bsscroll.closePullUp()
    },
    // 开启上拉
    openPullUp() {
      let self = this
      self.config.pullup &&
        self.bsscroll &&
        self.bsscroll.openPullUp({
          threshold: self.config.pullUpSize
        })
    },
    // 关闭下拉
    closePullDown() {
      let self = this
      self.config.pulldown && self.bsscroll && self.bsscroll.closePullDown()
    },
    // 开启下拉
    openPullDown() {
      let self = this
      self.config.pulldown &&
        self.bsscroll &&
        self.bsscroll.openPullDown({
          threshold: self.config.pullDownSize,
          stop: 0
        })
    },
    // 销毁
    destroy() {
      let self = this
      self.bsscroll && self.bsscroll.destroy()
      self.bsscroll = null
    },
    // 代理better-scroll的disable方法
    disable() {
      let self = this
      self.bsscroll && self.bsscroll.disable()
    },
    // 代理better-scroll的enable方法
    enable() {
      let self = this
      self.bsscroll && self.bsscroll.enable()
    },
    // 代理better-bsscroll的refresh方法
    refresh() {
      let self = this
      self.bsscroll && self.bsscroll.refresh()
    },
    // 代理better-scroll的scrollTo方法
    scrollTo() {
      let self = this
      self.bsscroll && self.bsscroll.scrollTo.apply(self.bsscroll, arguments)
    },
    // 代理better-scroll的scrollToElement方法
    scrollToElement() {
      let self = this
      self.bsscroll &&
        self.bsscroll.scrollToElement.apply(self.bsscroll, arguments)
    }
  }
}
</script>
<style>
/* scroll包裹层 */
.better-scroll-list-wrapper {
  overflow: hidden;
  position: relative;
  width: 100%;
  z-index: 1;
}
/* 滚动区域内容列表 */
.better-scroll-list-content {
  position: absolute;
  width: 100%;
  min-height: calc(100% + 1px); /* no */
}
/* 列表包裹层 */
.better-scroll-data-list-wrapper {
  padding: 1px 0 0 0;
  width: 100%;
}
/* 下拉时顶部提示区域样式 */
.better-scroll-list-pull-down {
  width: 100%;
  display: flex;
  height: 80px;
  justify-content: center;
  align-items: center;
}
/* 上拉底部提示区域样式 */
.better-scroll-list-pull-up {
  width: 100%;
  display: flex;
  height: 50px;
  justify-content: center;
  align-items: center;
}
</style>