import api from '../api.js'

export default {
  getStrategyCollection({}, payload) {
    return api.fetchCollection(payload).then(res => res)
  },
  getCollectState({}, payload) {
    return api.fetchCollectState(payload).then(res => res)
  },
  collectStrategy({}, payload) {
    return api.postCollect(payload).then(res => res)
  },
  getStartegyCategory() {
    return api.fetchStrategyCategory().then(res=> res.data)
  },
  deleteStrategy({},payload) {
    return api.postDeleteStrategy(payload).then(res => res)
  },
  getStrategy({commit}, payload) {
    return api.fetchStrategy(payload).then(res => res.data)
  },

  publish({},payload) {
    return api.postPublishStrategy(payload).then(res => res)
  },
  edit({},payload) {
    return api.postEditStrategy(payload).then(res => res)
  },
}