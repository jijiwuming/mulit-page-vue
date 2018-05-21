# better-scroll-vue

## 一个基于 better-scroll 封装的 vue 组件

## 配置项

* 参见 better-scroll-config.js

## 组件使用指南

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
