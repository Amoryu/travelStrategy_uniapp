import api from '../api.js'

export default {
  getScene() {
    return api.fetchSceneList().then(res => res.data)
  },
  getSingleScene({}, payload) {
    return api.fetchScene(payload).then(res => res.data)
  },
  getSearchScene({}, payload) {
    return api.fetchSearchScene(payload).then(res => res.data)
  },
  ticketPayment({}, payload) {
    return api.postTicketPayment(payload).then(res => res)
  },
  getTickets({}, payload) {
    return api.fetchTickets(payload).then(res => res.data)
  },
}