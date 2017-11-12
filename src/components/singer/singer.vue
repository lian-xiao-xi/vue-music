<template>
  <div class="singer">
    <div class="singer-listview">
      <v-scroll class="singer-scroll" :probeType="3" :data="singers" :listenScroll="true"
        v-on:scroll="scrollHander" ref="singerScroll">
        <ul>
          <li class="list-group" v-for="(type, index) in singers" ref="listGroup">
            <h2 class="group-title">{{type.title}}</h2>
            <ul class="" v-for="(item, index) in type.singerList">
              <li class="list-group-singer" @click="selectSinger(item)">
                <img class="avatar" v-lazy="item.avatar">
                <span class="name">{{item.name}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </v-scroll>
      <ul class="list-shortcut" @touchstart="touchScrollToList" @touchmove="touchmoveScrollToList" 
        ref="shortcutList">
        <li class="shortcut-item" v-for="(item,index) in shortcutList" 
        :data-index="index" :class="{current: curShortcut === index}">
          {{item}}
        </li>
      </ul>
      <div class="list-fixed" v-show="fixedTitle.trim()" ref="listFixed">
        <h2 class="fixed-title">{{fixedTitle}}</h2>
      </div>
      <div class="loading-wrap" v-show="!singers.length">
        <v-loading></v-loading>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from "@/base/scroll/scroll";
import Loading from "@/base/loading/loading";
import { getSingerList } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import {mapMutations} from 'vuex'
import Singer from "@/common/js/singer";

const HOT_TITLE = "热门歌手";
const HOT_SINGER_LEN = 10;

export default {
  name: "singerVue",
  data() {
    return {
      scrollY: 0,
      curShortcut: 0,
      diff: 0,
      touch: {},
      listHeight: [],
      singers: []
    };
  },
  created() {
    // setTimeout(() => {
      this._getSingerList();
    // }, 3000);
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
          console.log('数据singers为 ',this.singers);
          this.$nextTick(() => {
            // console.log("获得数据后立即调用this.$nextTick(),确保在下次DOM更新后立即更新scroll");
            this.$refs.singerScroll.refeshScroll();
            this.listHeight = this._calculateHeight()
          });
        }
      });
    },
    _normalizeSinger(datalist) {
      let map = {
        hot: {
          title: HOT_TITLE,
          singerList: []
        }
      };

      datalist.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.singerList.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }

        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            singerList: []
          };
        }

        map[key].singerList.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        );
      });
      let hotSingers = [],
        retSingers = [];
      for (let key in map) {
        let value = map[key];
        if (value.title === HOT_TITLE) {
          hotSingers.push(value);
        } else if (value.title.match(/[a-zA-Z]/)) {
          retSingers.push(value);
        }
      }

      retSingers.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      return hotSingers.concat(retSingers);
    },
    _calculateHeight() {
      let singerListGroup = this.$refs.listGroup;
      let height = 0;
      let resArr = [];
      resArr.push(height);
      // console.log(singerListGroup.length)
      for (let i = 0, len = singerListGroup.length; i < len; i++) {
        let item = singerListGroup[i];
        height += item.offsetHeight;
        resArr.push(height);
      }
      return resArr;
    },
    _scrollToTarget(index) {
      // 点击 .list-shortcut 元素的padding部分时候不滚动列表
      if(!index && index !== 0) return; 
      // 当从 .list-shortcut 列表下面一直向上 touchmove 很长距离时, index<0
      if(index < 0) index = 0;
      // 当从 .list-shortcut 列表上面一直向下 touchmove 很长距离时, 
      // 此时 index > this.listHeight.length - 2
      else if(index > this.listHeight.length - 2) index = this.listHeight.length - 2

      // 这里的滚动不触发better-scroll的scroll事件,需要手动改变this.scrollY
      this.scrollY = -this.listHeight[index];

      this.$refs.singerScroll.scrollToElement(this.$refs.listGroup[index], 0)
    },
    scrollHander(pos) {
      this.scrollY = pos.y;
    },
    touchScrollToList(event) {
      this.touch.y1 = event.touches[0].clientY
      const singerListGroup = this.$refs.listGroup
      const index = event.target.getAttribute('data-index');
      this.touch.anchorIndex = index
      this._scrollToTarget(index);
    },
    touchmoveScrollToList(event) {
      const height = this.$refs.shortcutList.children[0].offsetHeight
      this.touch.y2 = event.touches[0].clientY;
      let delta = Math.trunc((this.touch.y2 - this.touch.y1) / height)
      const index = parseInt(this.touch.anchorIndex) + delta;
      // console.log(delta,this.touch,index);
      this._scrollToTarget(index);
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  computed: {
    shortcutList() {
      return this.singers.map((item) => {
        return item.title.slice(0,1)
      })
    },
    fixedTitle() {
      // console.log(this.singers[this.curShortcut])
      if(this.scrollY > 0) return '';
      return this.singers[this.curShortcut] ? this.singers[this.curShortcut].title : ''
    }
  },
  watch: {
    singers: {
      handler: function (val, oldVal) {
        console.log('vue watch 属性观测到singer数据变化了')
        this.$nextTick(() => {
          this.$refs.singerScroll.refeshScroll();
          this.listHeight = this._calculateHeight()
        })
      },
      deep: true
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0
      if(newY >= 0) {
        this.curShortcut = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.curShortcut = i
            this.diff = height2 + newY
            return
          }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.curShortcut = this.listHeight.length -2;
    },
    diff(newDiff) {
      const titleHeight = this.$refs.listFixed.offsetHeight;
      let fixedTop = newDiff < titleHeight ? titleHeight - newDiff : 0;
      if (this.fixedTop === fixedTop) return 
      // 将改变 .list-fixed 元素的 transform,并用this.fixedTop 记录此次的 fixedTop 的值
      this.fixedTop = fixedTop
      this.$refs.listFixed.style.transform = `translate3d(0,-${fixedTop}px,0)`
    }
  },
  components: {
    "v-scroll": Scroll,
    "v-loading": Loading
    // 'v-singerdetail': singerDetail
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable-750';
@import '~@/common/stylus/mixin';

.singer 
  fixed-scroll()
.singer-listview 
  position: relative;
  z-index: 5
  width: 100%;
  height: 100%;
  overflow hidden
  .list-group 
    padding-bottom: 60px;
    .list-group-singer 
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      padding: 40px 0 0 60px;
      color: $color-text-l;
      .avatar 
        flex: 0 0 100px;
        display: block;
        width: 100px;
        height: 100px;
        margin-right: 40px;
        border-radius: 50%;
      .name 
        flex: 0 1 auto;
  .list-shortcut 
    position: absolute;
    z-index: 4;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    padding: 40px 0;
    line-height: 1;
    font-family: Helvetica;
    text-align: center;
    color: $color-text-l;
    border-radius: 20px;
    background-color: $color-background-d;
    .shortcut-item 
      width: 100%;
      padding: 6px;
      font-size: $font-size-small;
      &.current 
        color: $color-theme;
  .loading-wrap
    position absolute
    width 100%
    left 0
    right 0
    top 50%
    transform translateY(-50%)

  .list-fixed
    position absolute
    z-index 2
    top 0
    left 0
    right 0

.singer-listview
  .list-group .group-title, 
  .list-fixed .fixed-title
    height: 60px;
    width 100%
    padding-left: 40px;
    line-height: 60px;
    font-size: $font-size-small;
    color: $color-text-l;
    background-color: $color-highlight-background;
    overflow hidden
</style>

