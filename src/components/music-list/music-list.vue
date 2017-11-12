<template>
  <div class="music-list">
    <div class="back" @click="backHander">
      <i class="icon-back"></i>
    </div>
    <h1 class="list-title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="player-wrap" ref="player" v-show="songs.length">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <div class="songslist-scroll-wrap" ref="scrollWrap">
      <v-scroll class="songs-list-scroll" @scroll="scroll"
        :data="songs" :probeType="probeType" :listenScroll="listenScroll">
        <v-songslist :songs-list="songs" :ranking="ranking"></v-songslist>
      </v-scroll>
      <div class="loading-wrap" v-show="!songs.length">
        <v-loading></v-loading>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@/base/loading/loading'
import Scroll from "@/base/scroll/scroll";
import SongsList from '@/base/songs-list/songs-list'
import {prefixStyle} from '@/common/js/dom'

const RESERVED_HEIGHT = 40;
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  data() {
    return {
      probeType: 3,
      listenScroll: true,
      scrollY: 0
    }
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: '此处为音乐列表标题'
    },
    ranking: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    },
    backHander() {
      this.$router.back();
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTransalteY = RESERVED_HEIGHT - this.imageHeight
    this.$refs.scrollWrap.style['top'] = `${this.$refs.bgImage.offsetHeight}px`
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTransalteY, newY)
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      if(newY < this.minTransalteY) {
        this.$refs.bgImage.style['height'] = `${RESERVED_HEIGHT}px`;
        this.$refs.bgImage.style['z-index'] = '34';
        this.$refs.bgImage.style['padding-top'] = '0';
        this.$refs.player.style['display'] = 'none'
      } else {
        this.$refs.bgImage.style['height'] = ''
        this.$refs.bgImage.style['z-index'] = ''
        this.$refs.bgImage.style['padding-top'] = ''
        this.$refs.player.style['display'] = ''
      }

      const percent = Math.abs(newY/this.imageHeight);
      if(newY > 0) {
        this.$refs.bgImage.style[transform] = `scale(${1+percent})`
        this.$refs.bgImage.style['z-index'] = '34'
        this.$refs.filter.style['backdrop-filter'] = ''
        // this.$refs.filter.style['filter'] = ''
      } else if(newY > this.minTransalteY) {
        this.$refs.bgImage.style[transform] = '';
        this.$refs.bgImage.style['z-index'] = '';
        this.$refs.filter.style[backdrop] = `blur(${Math.min(20, percent * 30)}px)`
        // this.$refs.filter.style['filter'] = `blur(${Math.min(20, percent * 30)}px)`
      }
    }
  },
  components: {
    'v-songslist': SongsList,
    "v-scroll": Scroll,
    'v-loading': Loading
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable-750';
@import '~@/common/stylus/mixin';

.music-list
  position fixed
  z-index 100
  top 0 
  bottom 0
  right 0
  left 0
  background-color $color-background
  .back
    position absolute
    z-index 50
    top 0
    left 16px
    width 84px
    height 84px
    line-height 84px
    text-align center
    .icon-back
      display block
      line-height inherit
      font-size $font-size-large-x
      color $color-theme
  .list-title
    position absolute
    z-index 40
    top 0
    left 80px
    right 80px
    height 84px
    line-height 84px
    no-wrap()
    text-align center
    font-size $font-size-large
    color $color-text
  .bg-image
    position relative
    z-index 11
    width 100%
    height 0
    padding-top 70%
    background-color $color-background-d
    background-size cover
    background-position 50% 0
    background-repeat no-repeat
    transform-origin top
    transform scale(1)
    .player-wrap
      position absolute
      left 0
      bottom 8%
      width 100%
      z-index 50
      .play
        width 270px
        padding 14px 0
        margin 0 auto
        text-align center
        color $color-theme
        border 1px solid
        border-radius 200px
        font-size 0
      .icon-play, .text
        display inline-block
        vertical-align middle
      .icon-play
        margin-right 12px
        font-size $font-size-medium-x
      .text
        font-size $font-size-small
    .filter
      position absolute
      z-index 1
      top 0
      left 0
      width 100%
      height 100%
      background-color rgba(7,17,27,.4)
  .bg-layer
    position relative
    z-index 22
    height 100%
    background-color $color-background
  .songslist-scroll-wrap
    position absolute
    z-index 33
    top 0
    bottom 0
    width 100%
    background-color $color-background
    .songs-list-scroll
      overflow initial
    .loading-wrap
      position absolute
      left 0
      width 100%
      top 50%
      transform translateY(-50%)


</style>
