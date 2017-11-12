<template>
  <div id="app">
    <v-header></v-header>
    <nav class="tab">
      <router-link class="tab-item" to="/recommend" tag="div">
        <span class="text">推荐</span>
      </router-link>
      <router-link class="tab-item" to="/singer" tag="div">
        <span class="text">歌手</span>
      </router-link>
      <router-link class="tab-item" to="/ranking" tag="div">
        <span class="text">排行</span>
      </router-link>
      <router-link class="tab-item" to="/search" tag="div">
        <span class="text">搜索</span>
      </router-link>
    </nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import comHeader from "@/components/m-header/m-header";

export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  components: {
    "v-header": comHeader
  }
};
</script>

<style lang="stylus">
@import '~@/common/stylus/variable-750.styl'
// @import '~@/common/stylus/mixin.styl'

.tab
  display flex
  flex-flow row nowrap
  justify-content flex-start
  align-items stretch
  width 100%
  color $color-text-l
  .tab-item
    display block
    flex 1 1 0
    text-align center
    height 88px
    line-height 88px
    font-size $font-size-medium
    overflow hidden
    &.router-link-active .text
      color $color-theme
      border-bottom 4px solid
    .text
      padding-bottom 10px
      color inherit
</style>
