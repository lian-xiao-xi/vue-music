import * as types from './mutation-type'
const mutations = {
   [types.SET_SINGER](state, singer) {
     state.singer = singer;
   },
   [types.SET_DISC](state, disc) {
     state.disc = disc;
   },
   [types.SET_TOP_LIST](state, topList) {
     state.topList = topList;
   }
 }
 export default mutations