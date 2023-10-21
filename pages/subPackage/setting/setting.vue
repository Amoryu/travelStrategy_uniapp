<template>
  <view style="position: relative;">
    <van-dialog id="van-dialog" />
    <van-nav-bar title="设置" left-arrow z-index="99" fixed placeholder @click-left="back"></van-nav-bar>
    <!-- <van-skeleton title row="3" /> -->
     <van-cell-group> 
        <van-cell title="常见问题与反馈"  is-link/>
        <van-cell title="隐私政策"  is-link/>
      </van-cell-group>
      
      <view class="bottom-btn tac">
        <van-button block type="primary" @click="quitLogin"  custom-style="width:90vw;">退出登录</van-button>
      </view>
    
  </view>
</template>

<script>
  export default {
    methods: {
      quitLogin() {
        this.$utils.Dialog.confirm({
          title: '提示',
          message: '确认要退出当前账号吗',
        }).then(() => {  // on confirm
            wx.setStorage({ key: 'wxtoken', data: '' });
            wx.setStorage({ key: 'token', data: '' });
            wx.navigateTo({
              url: '/pages/login/login',
            });  
          }).catch(() => { });
      },
      back() {
        wx.switchTab({
          url: '/pages/user/user',
        });
      },
    },
  };
</script>

<style lang="scss">
  .bottom-btn {
    position: fixed;
    bottom: 5vh;
    width: 100vw;
  }
</style>
