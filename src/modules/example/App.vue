<template>
  <!-- <div id="app">
    <router-view/>
  </div> -->
  <!-- <div style="height:300px;overflow:hidden;width:100%"> -->
  <div>
    <scroll :pullup="true" :pulldown="true" @pulldown="refreshOver" @pullup="loadOver" ref="scroll" style="height:100px">
      <div>
        <div v-for="(item,index) in divItem" :key="index">1</div>
      </div>
    </scroll>
    <banner :bannerEnName="bannerEnName"></banner>
  </div>
  <!-- </div> -->
</template>

<script>
import xbBetterScroll from "../../components/better-scroll/xbBetterScroll";
import { setTimeout } from "timers";
import Banner from "../../components/banner-vue/Banner";
export default {
  name: "App",
  components: { scroll: xbBetterScroll, Banner },
  data() {
    return {
      noMore: false,
      height: "100px",
      divItem: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      bannerEnName: "app_home_middle_banner"
    };
  },
  methods: {
    refreshOver() {
      let self = this;
      console.log("pullup");
      window.setTimeout(function() {
        self.divItem = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        self.$refs.scroll.$emit("refreshOver");
      }, 2000);
    },
    loadOver() {
      let self = this;
      console.log("pulldown");
      window.setTimeout(function() {
        self.noMore = true;
        // self.divItem = self.divItem.concat(self.divItem);
        self.$refs.scroll.$emit("loadOver", self.noMore);
      }, 2000);
    }
  }
};
</script>

<style>
html,
body,
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
