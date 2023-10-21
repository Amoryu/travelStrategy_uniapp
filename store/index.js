import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 导入各模块的store
import common from "./common/index.js"
import scenery from "./scenery/index.js"
import strategy from "./strategy/index.js"
import user from "./user/index.js"
import hotel from "./hotel/index.js"
import order from "./order/index.js"

export default new Vuex.Store({
  modules: {
    common,
    scenery,
    strategy,
    user,
    hotel,
    order
  },
  state:{ },
  mutations:{ },
  actions: { },
  getters: { }
})
