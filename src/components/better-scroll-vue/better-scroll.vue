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
            <slot name="pull-down-stage3">加载中</slot>
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
      if (!this.$refs.betterScrollListWrapper) {
        return
      }
      // 配置BScroll参数
      this.bsscroll = new BScroll(this.$refs.betterScrollListWrapper, {
        probeType: this.config.probeType,
        click: this.config.click,
        scrollY: this.config.scrollY,
        pullDownRefresh: {
          threshold: this.config.pullDownSize,
          stop: 0
        },
        pullUpLoad: {
          threshold: this.config.pullUpSize
        }
      })
      // TODO: 此处为便于观察设置，后续去除
      window.bsscroll = this.bsscroll
      // 是否派发滚动事件
      if (this.config.listenScroll) {
        this.bsscroll.on('scroll', pos => {
          if (this.config.pulldown) {
            let oldState = this.pullDownState
            if (pos.y > 0) this.showPullDownTip = true
            if (oldState < 3) {
              if (pos.y > 0 && pos.y < this.config.pullDownSize) {
                this.pullDownState = 1
              }
              if (pos.y >= this.config.pullDownSize) {
                this.pullDownState = 2
              }
            }
          }
          // 重置下拉的显示
          if (pos.y <= 0) {
            this.pullDownState = 1
            this.showPullDownTip = false
          }
          this.$emit('scroll', pos)
        })
      }
      // 配置首次加载数据
      if (this.config.loadFirstPage) {
        // 派发首页加载事件
        this.$emit('loadFirstPage', this.PromiseLoadFirstPage())
      }
      // 是否派发滚动到底部事件，用于上拉加载
      if (this.config.pullup) {
        this.bsscroll.on('pullingUp', () => {
          this.PromisePullUp()
            .then(() => {
              // 调用上拉加载
            })
            .catch(err => {
              console.dir(err)
            })
        })
      } else {
        this.bsscroll && this.bsscroll.closePullUp()
      }
      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.config.pulldown) {
        this.bsscroll.on('pullingDown', () => {
          this.PromisePullDown()
            .then(() => {
              // 调用下拉刷新
            })
            .catch(err => {
              console.dir(err)
            })
        })
      } else {
        this.bsscroll && this.bsscroll.closePullDown()
      }
    },
    // 承诺首页加载
    PromiseLoadFirstPage() {
      if (this.config.pulldown && this.config.programTipLoad) {
        // 下拉加载首页
        return this.reloadPullDown()
      } else if (this.config.pullup && this.config.programTipLoad) {
        // 上拉加载首页
        return this.loadPullUp()
      } else {
        return new Promise((resolve, reject) => {
          this.config.loadDataFunc(1, this.config.pageSize).finally(() => {
            this.refresh()
          })
        })
      }
    },
    // 承诺下拉刷新
    PromisePullDown() {
      return new Promise((resolve, reject) => {
        if (this.config.pulldown) {
          if (!this.pullDownLoad) {
            // 关闭上拉
            this.closePullUp()
            // 下拉动作
            this.pullDownLoad = true
            this.pullDownState = 3
            this.config
              .loadDataFunc(1, this.config.pageSize)
              .finally(() => {
                this.endPullDownload()
              })
              .then(({ length }) => {
                this.allcount = length ? length : 0
                if (length && this.allcount <= this.data.length) {
                  // 上拉数据显示
                  this.showPullUpTip = true
                  this.pullUpState = 2
                } else {
                  // 消除上拉的区域样式
                  this.showPullUpTip = false
                  this.pullUpState = 1
                }
              })
            resolve()
          } else {
            this.bsscroll.finishPullDown()
          }
        }
        reject()
      })
    },
    // 承诺上拉加载
    PromisePullUp() {
      return new Promise((resolve, reject) => {
        if (this.config.pullup) {
          if (!this.pullUpLoad && this.pullUpState < 2) {
            // 关闭下拉
            this.closePullDown()
            // 上拉动作
            this.pullUpLoad = true
            this.showPullUpTip = true
            let pageIndex =
              Math.floor(this.data.length / this.config.pageSize) + 1
            this.config
              .loadDataFunc(pageIndex, this.config.pageSize)
              .finally(() => {
                this.endPullUpload()
              })
              .then(({ length }) => {
                this.allcount = length ? length : 0
                // 超过数量时
                if (length && this.allcount <= this.data.length) {
                  this.pullUpState = 2
                  this.showPullUpTip = true
                }
              })
            resolve()
          } else {
            this.bsscroll.finishPullUp()
          }
        }
        reject()
      })
    },
    // 下拉刷新方法
    reloadPullDown() {
      if (this.config.pulldown) {
        if (this.config.programTipLoad) {
          this.scrollTo(
            0,
            this.config.pullDownSize + 1,
            this.config.loadReadyTime,
            'swipe'
          )
        }
        // 使得代码调用时一直显示加载中
        setTimeout(() => {
          this.pullDownState = 3
        }, 0)
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.PromisePullDown()
              .then(() => {
                resolve()
              })
              .catch(err => {
                reject(err)
              })
          }, this.config.loadReadyTime)
        })
      } else {
        return Promise.reject('设置不允许下拉')
      }
    },
    // 上拉加载方法
    loadPullUp() {
      if (this.config.pullup) {
        if (this.config.programTipLoad) {
          this.scrollTo(
            0,
            this.bsscroll.maxScrollY + this.config.pullUpSize - 1,
            this.config.loadReadyTime,
            'swipe'
          )
        }
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.PromisePullUp()
              .then(() => {
                resolve()
              })
              .catch(err => {
                reject(err)
              })
          }, this.config.loadReadyTime)
        })
      } else {
        return Promise.reject('设置不允许上拉')
      }
    },
    // 结束上拉
    endPullUpload() {
      // 开启下拉
      this.openPullDown()
      // 结束上拉动作
      this.showPullUpTip = false
      this.bsscroll.finishPullUp()
      this.refresh()
      this.pullUpLoad = false
    },
    // 结束下拉
    endPullDownload() {
      // 开启上拉
      this.openPullUp()
      // 结束下拉动作
      this.showPullDownTip = false
      this.showPullUpTip = false
      this.bsscroll.finishPullDown()
      this.refresh()
      this.pullDownLoad = false
    },
    // 关闭上拉
    closePullUp() {
      this.config.pullup && this.bsscroll && this.bsscroll.closePullUp()
    },
    // 开启上拉
    openPullUp() {
      this.config.pullup &&
        this.bsscroll &&
        this.bsscroll.openPullUp({
          threshold: this.config.pullUpSize
        })
    },
    // 关闭下拉
    closePullDown() {
      this.config.pulldown && this.bsscroll && this.bsscroll.closePullDown()
    },
    // 开启下拉
    openPullDown() {
      this.config.pulldown &&
        this.bsscroll &&
        this.bsscroll.openPullDown({
          threshold: this.config.pullDownSize,
          stop: 0
        })
    },
    // 销毁
    destroy() {
      this.bsscroll && this.bsscroll.destroy()
      this.bsscroll = null
    },
    // 代理better-scroll的disable方法
    disable() {
      this.bsscroll && this.bsscroll.disable()
    },
    // 代理better-scroll的enable方法
    enable() {
      this.bsscroll && this.bsscroll.enable()
    },
    // 代理better-bsscroll的refresh方法
    refresh() {
      this.bsscroll && this.bsscroll.refresh()
    },
    // 代理better-scroll的scrollTo方法
    scrollTo() {
      this.bsscroll && this.bsscroll.scrollTo.apply(this.bsscroll, arguments)
    },
    // 代理better-scroll的scrollToElement方法
    scrollToElement() {
      this.bsscroll &&
        this.bsscroll.scrollToElement.apply(this.bsscroll, arguments)
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
  justify-content: center;
  align-items: center;
}
/* 上拉底部提示区域样式 */
.better-scroll-list-pull-up {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>