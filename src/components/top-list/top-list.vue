<template>
  <div class="toplist">
    <transition name="slide">
      <v-musiclist :title="title" :bg-image="bgImage" :songs="songs" :ranking='ranking'></v-musiclist>
    </transition>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import MusicList from '@/components/music-list/music-list'
import {createSong} from '@/common/js/song'
import {getMusicList} from '@/api/ranking'
import { ERR_OK } from "@/api/config";

export default {
  data() {
    return {
      songs: [],
      ranking: true
    }
  },
  created() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      if(this.topList.id == null) {
        this.$router.push({
          path: '/ranking'
        });
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if(res.code === ERR_OK) {
          // console.log(this._normalizeSongs(res.songlist))
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let res = [];
      list.forEach((item, index) => {
        if (item.data.songid && item.data.albummid) {
            res.push(createSong(item.data))
        }
      })
      return res;
    }
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if(this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
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


