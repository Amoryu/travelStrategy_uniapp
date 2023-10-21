import api from '../api.js'

export default {
  getRoom({},payload) {
    return api.fetchRoom(payload).then(res => res.data)
  },

  roomPayment({}, payload) {
    return api.postRoomPayment(payload).then(res => res)
  },
  getHotel({},payload) {
    return api.fetchHotel(payload).then(res => res.data)
  },
}