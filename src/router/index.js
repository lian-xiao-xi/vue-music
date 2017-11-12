import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/recommend.vue'
import Singer from '@/components/singer/singer.vue'
import Ranking from '@/components/ranking/ranking.vue'
import Search from '@/components/search/search.vue'
import SingerDetail from '@/components/singer-detail/singer-detail.vue'
import Disc from '@/components/disc/disc.vue'
import TopList from '@/components/top-list/top-list.vue'

Vue.use(Router)

/**
 * 项目中常用的英文单词及其汉语翻译
 * 推荐: recommend; 歌手: singer; 排行: ranking; 搜索: search;
 */
const EnglishToChinese = {
  recommend: '推荐',
  singer: '歌手',
  ranking: '排行',
  search: '搜索'
}

export default new Router({
  linkActiveClass: 'router-link-active',
  routes: [
    {
      path: '/',
      name: 'routeRoot',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'routeRecommend',
      component: Recommend,
      children: [
        {path: ':id', component: Disc}
      ]
    },
    {
      path: '/singer',
      name: 'routeSinger',
      component: Singer,
      children: [
        {path:':id', component: SingerDetail}
      ]
    },
    {
      path: '/ranking',
      name: 'routeRanking',
      component: Ranking,
      children: [
        {path: ':id', component: TopList}
      ]
    },
    {
      path: '/search',
      name: 'routeSearch',
      component: Search
    }

  ]
})
