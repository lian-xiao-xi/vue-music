<template>
  <div ref="scroll" class="scroll-wrap">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'scrollVue',
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      // console.log('初始化scroll')
      if(!this.$refs.scroll) return;
      this.scroll = new BScroll(this.$refs.scroll, {
        probeType: this.probeType,
        click: this.click
      });

      if(this.listenScroll) {
        let me = this;
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }
    })
  },
  methods: {
    refeshScroll() {
      this.scroll && this.scroll.refresh();
    },
    enableScroll() {
      this.scroll && this.scroll.enable()
    },
    disableScroll() {
      this.scroll && this.scroll.disable()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      // 使用apply调用此函数,便于传递函数参数
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
      this.$nextTick(() => {
        console.log('scroll组件watch到从父组件传入的data有变化,更新scroll组件')
        this.refeshScroll()
      })
    }
  }
}
</script>
<style lang="stylus">
.scroll-wrap
  width 100%
  height 100%
  overflow hidden
</style>

