import api from '../api.js'

export default {
  getWxUser({commit}, payload) {
    return api.login(payload).then(res => {
      // commit('SET_USERINFO',res.data)
      return res
    })
  },
  getUser({commit},payload) {
    return api.fetchUser(payload).then(res => {
      // commit('SET_USERINFO',res.data)
      return res
    })
  },
  userLogin({commit},payload) {
    return api.login(payload).then(res => {
      return res
    })
  },
  registerUser({},payload) {
    return api.register(payload).then(res => res)
  },
  updateUserInfo({},payload) {
    return api.postUpdateUserInfo(payload).then(res => res)
  },
  getArticleAuthor() {
    return api.fetchArticleAuthor().then(res => res)
  },
}