import api from '../api.js'

export default {
  getShopCart({},payload){
    return api.fetachCart(payload).then(res => res.data)
  },
  getOrder({}, payload) {
    return api.fetchOrder(payload).then(res => res.data)
  },
  addShopCart({}, payload) {
    return api.postAddCart(payload).then(res => res)
  }
}