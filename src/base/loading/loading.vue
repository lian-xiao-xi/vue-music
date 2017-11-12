<template>
  <div class="loading">
    <img src="./image/loading.gif" alt="加载中..." class="loading-img">
    <p class="desc">{{loadDesc}}</p>
  </div>
</template>

<script>
export default {
  name: "loadingVue",
  props: {
    loadDesc: {
      type: String,
      default: "正在载入..."
    }
  }
};
</script>

<style lang="stylus">
@import '~@/common/stylus/variable-750';

.loading 
  width: 100%;
  text-align: center;
  .loading-img 
    width 48px
    height 48px
  .desc 
    line-height: 40px;
    font-size: $font-size-small;
    color: $color-text-l;

</style>
