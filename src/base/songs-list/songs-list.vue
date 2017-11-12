<template>
  <div class="songs-list">
    <ul>
      <li class="song" v-for="(item, index) in songsList">
        <div class="rank" v-show="ranking">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{item.singer}} · {{item.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props: {
    songsList: {
      type: Array,
      default() {
        return []
      }
    },
    ranking: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getRankCls(index) {
      if(index <= 2) {
        return `icon icon${index}`
      }
      return 'text'
    },
    getRankText(index) {
      if(index>2) {
        return index+1
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable-750';
@import '~@/common/stylus/mixin';

.songs-list
  .song
    display flex
    position relative
    flex-flow row nowrap
    justify-content flex-start
    align-items center
    padding 20px 60px
    font-size $font-size-medium
    &:first-child, &:last-child
      padding-top 40px
    .rank
      flex 0 0 50px
      width 50px
      margin-right 60px
      text-align center
      .icon
        display block
        height 48px
        background-size 100% 100%
        &.icon0
          bg-image('./images/first')
        &.icon1
          bg-image('./images/second')
        &.icon2
          bg-image('./images/third')
      .text
        color $color-theme
        font-size $font-size-large
    .content
      flex 1 1 auto
      line-height 40px
      overflow hidden
      .name
        no-wrap()
        color $color-text
        margin-bottom 8px
      .desc
        no-wrap()
        color $color-text-d



</style>

