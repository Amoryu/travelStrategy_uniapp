import api from '../api.js'

export default {
  getSwiper() {
    return api.fetchSwiperPic().then(res => res.data)
  },
  getCurrentArea() {
    return api.fetchCurrentArea().then(res => res.data)
  },
  changeCurrentArea({},payload) {
    return api.postCurrentArea(payload).then(res => res.data)
  },
  getTourRoute() {
    return api.fetchTourRoute().then(res => res.data)
  },
  getBillBoard({},payload) {
    return api.fetchBillBoard(payload).then(res => res.data)
  },
  // setCurrentArea({commit},data) {
  //   commit('SET_CURRENTAREA',data)
  // },
}