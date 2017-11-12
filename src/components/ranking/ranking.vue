<template>
  <div class="ranking">
    <div class="ranking-listview">
      <v-scroll class="ranking-scroll" :data="topList">
        <ul class="ranking-list">
          <li class="list-item" @click="selectItem(item)" v-for="item in topList">
            <div class="icon">
              <img :src="item.picUrl" :alt="item.topTitle" width="100" height="auto">
            </div>
            <ul class="songlist">
              <li class="song" v-for="(song, index) in item.songList">
                {{index+1}} {{song.singername}} - {{song.songname}}
              </li>
            </ul>
          </li>
        </ul>
      </v-scroll>
      <div class="loading-wrap" v-show="!topList.length">
        <v-loading></v-loading>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Loading from '@/base/loading/loading'
import Scroll from "@/base/scroll/scroll";
import {getTopList} from '@/api/ranking'
import { ERR_OK } from "@/api/config";
import {mapMutations} from 'vuex'

export default {
  name: 'rankingVue',
  created() {
    this._getTopList()
  },
  data() {
    return {
      topList: []
    }
  },
  methods: {
    _getTopList() {
      getTopList().then((res) => {
        if(res.code === ERR_OK) {
          console.log(res.data.topList)
          this.topList = res.data.topList
        }
      })
    },
  selectItem(item) {
    this.$router.push({
      path: `/ranking/${item.id}`
    })
    this.setTopList(item);
  },
  ...mapMutations({
    setTopList: 'SET_TOP_LIST'
  })
  },
  components: {
    "v-scroll": Scroll,
    'v-loading': Loading
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/mixin';
@import '~@/common/stylus/variable-750';

.ranking
  fixed-scroll()
  .ranking-listview
    position relative
    height 100%
    overflow hidden
    .ranking-list
      padding-left 40px
      padding-right 40px
    .list-item
      display flex
      flex-flow row nowrap
      justify-content flex-start
      align-items stretch
      height 240px
      padding-top 40px
      .icon
        flex 0 0 200px
        width 200px
        height 100%
        overflow hidden
        img
          max-width 100%
          height auto
          display block
      .songlist
        flex 1 1 auto
        height 100%
        padding-left 40px
        padding-right 40px
        display flex
        flex-flow column nowrap
        justify-content center
        align-items flex-start
        background-color $color-highlight-background
        color $color-text-d
        font-size $font-size-small
        overflow hidden
        .song
          no-wrap()
          line-height 52px
          max-width 100%
    .loading-wrap
      position absolute
      width 100%
      left 0
      right 0
      top 50%
      transform translateY(-50%)
</style>

