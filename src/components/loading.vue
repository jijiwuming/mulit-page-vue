<template>
    <div class="full-page-wrapper" v-show="isloading">
        <slot>
            <span class="loading-in-processing">处理中···</span>
        </slot>
    </div>
</template>
<style>
/* 整页包裹层 */
.full-page-wrapper {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.2);
}
/* 处理中span样式 */
span.loading-in-processing {
  display: block;
  width: 3.333rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  font-size: 0.4rem;
  border-radius: 0.27rem;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
}
</style>
<script>
export default {
  props: {
    // 是否在加载中
    isloading: {
      type: Boolean,
      required: true
    }
  }
}
</script>
