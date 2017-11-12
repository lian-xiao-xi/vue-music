<template>
  <transition name="slide">
    <v-musiclist :title="singer.name" :bg-image="singer.avatar" :songs="songs"></v-musiclist>
  </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import {getSingerDetail} from '@/api/singer'
import { ERR_OK } from "@/api/config";
import {createSong} from '@/common/js/song'
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getSingerDetail();
  },
  methods: {
    _getSingerDetail() {
      // 当用户在歌手详情页刷新时,回退到歌手列表页
      if(this.singer.id == null) {
        this.$router.push({path: '/singer'})
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if(res.code === ERR_OK) {
          // console.log(res.data.list)
          this.songs = this._normalizeSongs(res.data.list)
          console.log('歌手歌曲数据为',this.songs)
        }
      })

    },
    _normalizeSongs(list) {
      let resArr = [];
      list.forEach((item) => {
        let musicData = item.musicData;
        // 排除 musicData 中没有 songid 和 albummid 的项,
        // 因为没有这两样数据将没有专辑封面和歌曲音频链接
        if(musicData.songid && musicData.albummid) {
          resArr.push(createSong(musicData))
        }
      })
      return resArr
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  components: {
    'v-musiclist': MusicList
  }
}
</script>

<style lang="stylus">
// @import '~@/common/stylus/variable-750';
@import '~@/common/stylus/animation';

</style>

