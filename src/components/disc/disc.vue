<template>
  <transition name="slide">
    <v-musiclist :title="title" :bg-image="bgImage" :songs="songs"></v-musiclist>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSongList} from '@/api/recommend'
import MusicList from '@/components/music-list/music-list'
import { ERR_OK } from "@/api/config";
import {createSong} from '@/common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList() {
      if(this.disc.dissid == null) {
        this.$router.push({path: '/recommend'});
        return;
      }
      getSongList(this.disc.dissid).then((res) => {
        if(res.code === ERR_OK) {
          console.log('整理后的歌单歌曲数据为',this._normalizeSongs(res.cdlist[0].songlist))
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })


    },
    _normalizeSongs(list) {
      let res = [];
      list.forEach((item) => {
        if (item.songid && item.albummid) {
            res.push(createSong(item))
        }
      })
      return res
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  components: {
    'v-musiclist': MusicList
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/animation';

</style>


