<template>
  <div class="hello">
    <!-- 此处开始使用组件 -->
    <BetterScroll class="example-bsscroll" :data="list" :config="bsconfig">
      <!-- 下拉刷新阶段内容 -->
      <span slot="pull-down-stage1">pulling down</span>
      <!-- 可以释放阶段内容 -->
      <span slot="pull-down-stage2">well,you can release now</span>
      <!-- 加载阶段内容 -->
      <span slot="pull-down-stage3">loading</span>
      <div v-for="(item,index) in list" :key="index" class="example-list-item" @click="deleteIt(item)">{{item}}</div>
      <!-- 上拉加载中 -->
      <span slot="pull-up-stage1">loading</span>
      <!-- 全部加载完成 -->
      <span slot="pull-up-stage2">all loaded</span>
    </BetterScroll>
  </div>
</template>

<script>
import { BSScrollConfig } from '../../../components/better-scroll-vue/better-scroll-config.js'
import BetterScroll from '../../../components/better-scroll-vue/better-scroll'
import { getArrs } from '../api/api.js'
export default {
  name: 'HelloWorld',
  components: {
    BetterScroll
  },
  data() {
    return {
      list: [],
      bsconfig: new BSScrollConfig({
        // 此处仅配置这几项参数
        // loadDataFunc不可缺省，否则上拉加载一直有效
        loadDataFunc: this.loadData,
        pageSize: 4
      })
    }
  },
  methods: {
    // 该函数会传入两个参数，pageIndex为页数[从1开始]，pageSize为每个页面条数
    loadData: function(pageIndex, pageSize) {
      return getArrs().then(res => {
        // 操作数据
        console.dir(res)
        if (pageIndex === 1) {
          this.list = res.list
        } else {
          let startSize = (pageIndex - 1) * pageSize
          let deletelength = this.list.length - startSize
          this.list.splice(startSize, deletelength)
          this.list = this.list.concat(res.list)
        }
        // 返回的promise必须传递一个带length属性的对象，length为总共拥有的数据长度
        return {
          length: res.length
        }
      })
    },
    deleteIt(item) {
      this.list.splice(this.list.findIndex(i => i === item), 1)
    }
  }
}
</script>

<style>
html,
body,
#app {
  height: 100%;
}
.hello {
  height: 100%;
}
/* 该元素必须设置高度，否则不可见 */
.example-bsscroll {
  height: 100%;
}
.example-list-item {
  width: 100%;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: aqua;
  border-bottom: 1px solid #ffffff; /* no */
}
</style>
