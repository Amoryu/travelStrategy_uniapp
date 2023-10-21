import request from "@/utils/request.js"

export default {
  /**
   * 用户接口
   */
  postUpdateUserInfo(payload) {
    return request.put('/user/info', payload);
  },
  fetchArticleAuthor() {
    return request.get('/users');
  },
  fetchUser(payload) {
    return request.get('/user', payload);
  },
  login(payload) {
    return request.post('/user/login', payload);
  },
  register(payload) {
    return request.put('/register', payload);
  },

  //******************************************************************//
  /**
   * 订单接口
   */
  fetchOrder(payload) {
    return request.get('/order', payload);
  },
  postTicketPayment(payload) {
    return request.post('/ticket/payment', payload);
  },
  postRoomPayment(payload) {
    return request.post('/room/payment', payload);
  },
  // 购物车
  fetachCart(payload) {
    return request.get('/cart', payload);
  },
  postAddCart(payload) {
    return request.post('/cart', payload);
  },

  //******************************************************************//

  /**
   * 酒店接口
   */
  fetchHotel(payload) {
    return request.get('/hotel', payload);
  },
  // 房间
  fetchRoom(payload) {
    return request.get('/room', payload);
  },

  //******************************************************************//
  /**
   * 景点接口
   */
  fetchSearchScene(payload) {
    return request.get('/scenery/search', payload);
  },
  fetchSceneList() {
    return request.get('/scenery/all');
  },
  fetchScene(payload) {
    return request.get('/scenery', payload);
  },
  //门票
  fetchTickets(payload) {
    return request.get('/ticket', payload);
  },

  //******************************************************************//
  /**
   * 公共接口
   */
  fetchBillBoard(payload) {
    return request.post('/billboard', payload);
  },
  fetchSwiperPic() {
    return request.get('/swiper');
  },
  postImage(payload) {
    return request.post('/image', payload);
  },
  fetchTourRoute() {
    return request.get('/route');
  },
  //地址接口
  fetchCurrentArea() {
    return request.get('/curArea');
  },
  postCurrentArea(payload) {
    return request.post('/curArea', payload);
  },

  //******************************************************************//
  /**
   * 攻略接口
   */
  fetchStrategy(payload) {
    return request.get('/strategy', payload);
  },
  fetchStrategyCategory(payload) {
    return request.get('/strategy/type');
  },
  postDeleteStrategy(payload) {
    return request.delete('/strategy', payload);
  },
  postPublishStrategy(payload) {
    return request.post('/strategy', payload);
  },
  postEditStrategy(payload) {
    // return request.put('/edit', payload);
    return request.put('/strategy', payload);   //换接口试试
  },

  // 收藏相关
  postCollect(payload) {
    return request.post('/collection', payload);
  },
  fetchCollection(payload) {
    return request.get('/collection', payload);
  },
  fetchCollectState(payload) {
    return request.get('/collection/status', payload);
  },
};
