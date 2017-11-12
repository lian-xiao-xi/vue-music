import Vue from 'vue'
import Vuex from 'vuex'
// 通过 mutations 修改 state 时,在控制台打印出相关信息
import createLogger from 'vuex/dist/logger'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

