  import Notify from '@/wxcomponents/@vant/weapp/notify/notify'
  import Dialog from '@/wxcomponents/@vant/weapp/dialog/dialog';
  import Toast from '@/wxcomponents/@vant/weapp/toast/toast';

  const showToast = (msg, status = 'success', duration = 1000, success = null, fail = null, complete = null) => {
    wx.showToast({
      title: msg,
      icon: status,
      duration: duration,
      mask:true,
      success:success,
      fail: fail,
      complete: complete
    })
  }


  export default {
    Notify,
    Dialog,
    Toast,
    showToast
  }