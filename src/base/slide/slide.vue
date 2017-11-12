<template>
  <div class="slide" ref="slide">
    <div class="slide-group" ref="slideGroup">
      <slot></slot>
    </div>
    <div v-if="showDot" class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" 
      :class="{active: currentPageIndex === index }"></span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
const COMPONENT_NAME = "slide";

export default {
  name: COMPONENT_NAME,
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 5000
    },
    speed: {
      type: Number,
      default: 400
    },
    showDot: {
      type: Boolean,
      default: true
    },
    click: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    // console.log('mounted')
    setTimeout(() => {
      this._setSlideWidth();
      if (this.showDot) {
        this._initDots();
      }      
      this._initSlide();
      if (this.autoPlay) {
        this._play();
      }
    }, 20);
    window.addEventListener("resize", () => {
      if (!this.slide || !this.slide.enabled) {
        return;
      }
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.slide.isInTransition) {
          this._onScrollEnd();
        } else {
          if (this.autoPlay) {
            this._play();
          }
        }
        this.refresh();
      }, 60);
    });
  },
  activated() {
    if (!this.slide) {
      return;
    }
    this.slide.enable();
    let pageIndex = this.slide.getCurrentPage().pageX;
    if (pageIndex > this.dots.length) {
      pageIndex = pageIndex % this.dots.length;
    }
    this.slide.goToPage(pageIndex, 0, 0);
    if (this.loop) {
      pageIndex -= 1;
    }
    this.currentPageIndex = pageIndex;
    if (this.autoPlay) {
      this._play();
    }
  },
  deactivated() {
    this.slide.disable();
    clearTimeout(this.timer);
  },
  beforeDestroy() {
    this.slide.disable();
    clearTimeout(this.timer);
  },
  methods: {
    refresh() {
      this._setSlideWidth(true);
      this.slide.refresh();
    },
    next() {
      this.slide.next();
    },
    _setSlideWidth(isResize) {
      // console.log('_setSlideWidth 函数已执行')
        this.children = this.$refs.slideGroup.children;
        let slideWidth = this.$refs.slide.offsetWidth;
        let width = 0;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          child.classList.add("slide-item");
          child.style.width = slideWidth + "px";
          width += child.offsetWidth;
        }
        if (this.loop && !isResize) width += slideWidth * 2;
        this.$refs.slideGroup.style.width = width + "px";
    },
    _initSlide() {
      // console.log('_initSlide 函数已执行')
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3, // 滚动距离超过宽度/高度的 30% 时切换图片
          speed: this.speed // 切换动画时长
        },
        click: this.click
      });
      this.slide.on("scrollEnd", () => {
        // console.log('scrollEnd事件执行函数已执行')
        this._onScrollEnd()
      });
      this.slide.on("touchEnd", () => {
        // console.log('touchEnd事件执行函数已执行')
        if (this.autoPlay) this._play();
      });
      this.slide.on("beforeScrollStart", () => {
        // console.log('beforeScrollStart事件执行函数已执行')
        if (this.autoPlay) clearTimeout(this.timer);
      });
    },
    _onScrollEnd() {
      // console.log('_onScrollEnd 函数已执行')
      let pageIndex = this.slide.getCurrentPage().pageX;
      if (this.loop) pageIndex -= 1;
      // console.log(pageIndex);
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) this._play();
    },
    _play() {
      // console.log('_paly函数已执行','当前页面为'+ ' ' + this.slide.getCurrentPage().pageX)
      let nextPageIndex = this.slide.getCurrentPage().pageX + 1;
      // console.log(nextPageIndex);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slide.goToPage(nextPageIndex, 0, this.speed);
      }, this.interval);
    },
    _initDots() {
      // console.log('_initDots 函数已执行')
      this.dots = new Array(this.children.length);
    }
  }
};
</script>

<style lang="stylus">
@import '~@/common/stylus/variable-750';

.slide {
  min-height: 1px;
  .slide-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slide-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    // transform: translateZ(1px);
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 8px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(144,144,144,.8);

      &.active {
        background: #fff;
      }
    }
  }
}
</style>

