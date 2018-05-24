# better-scroll-vue

## 一个基于 better-scroll 封装的 vue 组件

## 组件配置项[Config]

* 参见 better-scroll-config.js

> ### 大致的配置项如下

| 参数名         | 参数说明                                                                                                                                                            |
| -------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| loadDataFunc   | 加载数据的函数                                                                                                                                                      |
| pageSize       | 页面大小                                                                                                                                                            |
| loadFirstPage  | 是否自动加载首页，默认加载                                                                                                                                          |
| loadReadyTime  | 以代码加载时的过程时间，以毫秒计，默认 300                                                                                                                          |
| programTipLoad | 以代码加载和首页加载时是否显示提示内容，默认 true                                                                                                                   |
| showAllLoaded  | 显示全部加载文本时的数据条数，<0 永不显示，其他 n-多于等于 n 条显示该文本，默认为 0                                                                                 |
| probeType      | scroll 事件派发设置:1-滚动时派发 scroll 事件，会截流。2-滚动时实时派发 scroll 事件，不截流。3-除了实时派发 scroll 事件，在 swipe 的情况下仍然能实时派发 scroll 事件 |
| click          | 点击列表是否派发 click 事件                                                                                                                                         |
| scrollY        | 是否开启纵向滚动                                                                                                                                                    |
| listenScroll   | 是否开启滚动监听                                                                                                                                                    |
| pullup         | 是否开启上拉加载                                                                                                                                                    |
| pullUpSize     | 上拉触发距离                                                                                                                                                        |
| pulldown       | 是否开启下拉刷新                                                                                                                                                    |
| pullDownSize   | 下拉触发距离                                                                                                                                                        |

## 组件触发事件[Event]

| 事件名        | 参数说明                   | 事件说明                                                                                                                               |
| ------------- | :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| scroll        | pos: {x,y} 滚动的实时坐标  | 组件滚动过程中触发，具体时机取决于选项中的 [probeType](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options.html#probetype) |
| loadFirstPage | promise 首页加载的 Promise | 组件首次加载时触发，通过参数获取加载事件状态                                                                                           |

## 组件使用指南[Usage]

```javascript
// 在js中
import { BSScrollConfig } from '../../../components/better-scroll-vue/better-scroll-config.js'
import BetterScroll from '../../../components/better-scroll-vue/better-scroll'
export default {
  components: {
    BetterScroll
  },
  data() {
    return {
      list: [],
      bsconfig: new BSScrollConfig({
        // 数据加载函数不可缺省，否则上拉加载一直有效
        // 此处配置为下方的loadData
        loadDataFunc: this.loadData,
        pageSize: 4
      })
    }
  },
  methods: {
    // 该函数会传入两个参数，pageIndex为页数[从1开始]，pageSize为每个页面条数
    loadData: function(pageIndex, pageSize) {
      // getArrs是个返回promise的函数
      return getArrs().then(res => {
        // 操作数据
        console.dir(res)
        if (pageIndex === 1) {
          this.list = res.list
        } else {
          this.list = this.list.concat(res.list)
        }
        // 返回的promise必须传递一个带length属性的对象，length为总共拥有的数据长度
        return {
          length: res.length
        }
      })
    }
  }
}
```

```html
<!-- html中 -->
<BetterScroll class="example-bsscroll" :data="list" :config="bsconfig">
    <div v-for="(item,index) in list" :key="index" class="example-list-item">{{item}}</div>
</BetterScroll>
```

```css
/* css中 */
/* 该元素必须设置高度，否则不可见 */
.example-bsscroll {
  height: 100%;
}
```

### tips: 可参照 example 中给出的 [Demo](../../modules/example/components/HelloWorld.vue)
