import config from '../common/config/config.js'
let baseURL = config.baseUrl + "/api"

const request = (url, method, data = {}) => {
  return new Promise((resolve,reject) => {
    wx.request({
      url: baseURL + url,
      method,
      data,
      header:{
        "content-type": method === "DELETE" ? "application/x-www-form-urlencoded" :'application/json'
      },
      success: res => { resolve(res.data) },
      fail: err => { reject(err) }
    }) 
  })
}


export default {
  get(url, data) {
    return request(url, "GET", data) 
  },
  post(url, data) {
    return request(url, "POST", data)
  },
  delete(url, data) {
    return request(url, "DELETE", data)
  },
  put(url, data) {
    return request(url, "PUT", data)
  }
}


