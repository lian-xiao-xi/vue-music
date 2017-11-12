<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'headerVue'
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
// ~ 是stylus-loader的东西，表示相对于~后面的路径，配合webpack.base.conf.js 中的 resolve 使用
// @ 是 webpack.base.conf.js 中 resolve 的东西，表示此项目的 src/ 路径
@import "~@/common/stylus/mixin"
@import "~@/common/stylus/variable-750.styl";

.m-header
  display flex
  position: relative
  flex-flow row nowrap 
  justify-content center
  align-items  center
  height: 88px
  color: $color-theme
  font-size inherit
  .icon
    display block
    flex 0 0 60px
    width: 60px
    height: 64px
    margin-right: 18px
    bg-image('./images/logo')
    background-size: 100% 100%
  .text
    font-size: $font-size-large
  .mine
    display flex;
    flex-flow row nowrap
    justify-content center
    align-items center
    position: absolute
    top: 0
    right: 0
    height 100%
    padding: 0 24px
    .icon-mine
      display block
      font-size 40px


</style>