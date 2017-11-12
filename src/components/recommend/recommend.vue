<template>
  <div class="recommend">
    <v-scroll class="recommend-scroll" :data="discList" ref="recommendScroll">
    <div>
      <div class="swiper-wrap" v-if="recommends.length">
        <div class="slide-content">
          <v-slide :loop="slideOptions.loop" :autoPlay="slideOptions.autoPlay" 
          :interval="slideOptions.interval" :speed="slideOptions.speed" 
          :showDot="slideOptions.showDot" :click="slideOptions.click">
            <div v-for="(item, index) in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <!-- 添加了 needsclick 类的元素的点击事件不会被fastclick库拦截 -->
                <img :src="item.picUrl" @load="loadImage" class="needsclick" alt="推荐">
              </a>
            </div>
          </v-slide>
        </div>
      </div>
      <div class="recommend-list"  >
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li class="list-item" v-for="(item, index) in discList" @click="selectDisc(item)">
            <div class="img">
              <img v-lazy="item.imgurl" width="60">
            </div>
            <div class="text">
              <h2 class="name">{{item.creator.name}}</h2>
              <p class="desc">{{item.dissname}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    </v-scroll>
    <div class="loading-wrap" v-show="!discList.length">
      <v-loading></v-loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {getRecommend, getDiscList} from '@/api/recommend'
import {ERR_OK} from '@/api/config'
import Slide from '@/base/slide/slide'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import {mapMutations} from 'vuex'
  
export default {
  name: 'recommendVue',
  data() {
    return {
      slideOptions: {
        loop: false,
        autoPlay: true,
        interval: 5500,
        speed: 400,
        showDot: true,
        click: true
      },
      recommends: [],
      discList: []
    }
  },
  created() {
    this._getRecommend()
    // setTimeout(() => {
      this._getDiscList()
    // }, 10000);
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        if(res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        console.log(res);
        if(res.code === ERR_OK) {
          console.log(res.data)
          this.discList = res.data.list
        }
      })
    },
    loadImage() {
      // checkImageLoad 作为标志位: 确保只需要一张轮播图执行onload事件
      if(!this.checkImageLoad) {
        this.checkImageLoad = true;
        this.$refs.recommendScroll.refeshScroll()
      }
    },
    selectDisc(disc) {
      this.$router.push({
        path: `recommend/${disc.dissid}`
      });
      this.setDisc(disc);
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    'v-slide': Slide,
    'v-scroll': Scroll,
    'v-loading': Loading
  },
  watch: {
    recommends: {
      handler: function (val, oldVal) {
      console.log('vue watch 属性观测到recommends数据变化了')
      this.$nextTick(() => {
        this.$refs.recommendScroll.refeshScroll();
      })
      },
      deep: true
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable-750'
@import '~@/common/stylus/mixin';

.recommend
  fixed-scroll()
  -webkit-overflow-scrolling: touch;
  .swiper-wrap
    position: relative;
    width: 100%;
    height: 0;
    padding-top 40%
    z-index: 1;
    overflow: hidden;
    .slide-content
      position absolute
      top 0
      left 0
      width 100%
      height 100%
  .recommend-list
    .list-title
      display block
      line-height 130px
      font-size $font-size-medium 
      text-align center
      color $color-theme
    .list-item
      display flex
      position relative
      padding 0 40px 40px
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      .img
        flex 0 0 120px
        width 120px
        margin-right 40px
        overflow hidden
        img
          display block
          max-width 100%
          height auto
      .text
        flex: 1 1 auto
        overflow hidden
        font-size $font-size-medium
        line-height 40px
        .name
          margin-bottom 20px
          color $color-text
        .desc
          color $color-text-d
          display -webkit-box
          -webkit-box-orient vertical
          -webkit-line-clamp: 2;
          overflow hidden
          text-overflow ellipsis
  .loading-wrap
    position: absolute
    width: 100%
    left 0
    right 0
    top: 50%
    transform: translateY(-50%)

</style>

