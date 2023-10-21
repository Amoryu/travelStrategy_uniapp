<template>
  <view class="main"> 
    <view class="header">
      <van-image
        width="16vw"
        height="16vw"
        fit="contain"
        src="http://192.168.1.100:8098/uploads/swiper/logo.png"
      />
      <view style="margin:8vw 10px;">欢迎使用薛定猫</view>
    </view>
    <view class="center-box">
      <view class="nav">
        <view class="left" :class="current==1?'select':''" @click="changeTab" data-code="1"><text>登录</text></view>
        <view class="right" :class="current==0?'select':''"  @click="changeTab" data-code="0"><text>注册</text></view>
      </view>
      <!-- 登录 -->
      <view :hidden="current==0">
        <van-cell-group :border="false">
          <van-field label="账号" type="number" clearable  
            :value="loginForm.username"
            @blur="e => loginForm.username = e.detail.value"
            left-icon="phone-o" title-width="35px"        
            placeholder="请输入手机号/登录名" placeholder-style="font-weight: Normal"
            custom-style="font-size: 16px; font-weight: bold"/>
          <van-field label="密码" clearable password
            :value="loginForm.password"
            @blur="e => loginForm.password = e.detail.value"
            left-icon="more-o"  title-width="35px"
            placeholder="请输入密码" placeholder-style="font-weight: Normal"
            custom-style="font-size: 16px; font-weight: bold"/>
          </van-cell-group>
        <view class="sumbit-btn">
          <button class="btn" type="primary" @click="handleLogin">立即登录</button>
        </view>
      </view>
      <!-- 注册 -->
      <view :hidden="current==1">
        <van-cell-group :border="false">
         <van-field label="手机号码" clearable type="number"
            :value="registerForm.userName"
            @blur="e => registerForm.userName = e.detail.value"
            left-icon="phone-o" title-width="65px"
            placeholder="请输入手机号/登录名" placeholder-style="font-weight: Normal"
            custom-style="font-size: 16px; font-weight: bold"/>
          <van-field  label="密码" clearable password
            :value="registerForm.password"
            @blur="e => registerForm.password = e.detail.value"
             left-icon="more-o" title-width="65px"
             placeholder="请输入密码" placeholder-style="font-weight: Normal"
            custom-style="font-size: 16px; font-weight: bold"
            />
          <van-field label="确认密码" clearable password
            :value="registerForm.passwordAgain"
             @blur="e => registerForm.passwordAgain = e.detail.value"
             left-icon="more-o" title-width="65px"
            placeholder="请再次输入密码" placeholder-style="font-weight: Normal"
            custom-style="font-size: 16px; font-weight: bold"/>
          </van-cell-group>
        <view class="sumbit-btn">
          <button class="button" style="background-color: #33ccff;font-size: 30rpx;" 
          type="primary" @click="handleRegister">立即注册</button>
        </view>
      </view>
      
    </view>
    <!-- 重影 -->
    <view class="shadow shadow-1"></view>
    <view class="shadow shadow-2"></view>
    
    <view class="bottom-box">
      <view class="wechat" @click="handleWxAuth"><van-icon name="wechat" size="25px" color="white"/></view>
      <van-popup :show="showWxAuth" round closeable z-index="99" overlay position="bottom" custom-style="height: 50%" @close="quitWxAuth">
        <view class="tac">
          <view class="title">申请获取以下权限</view>
          <text class="msg">获取你的公开信息（昵称、头像、地区等）</text>
        </view>

        <form @submit="handleWxLogin">
          <van-cell-group :border="false">
            <van-cell title="头像" center title-width="98px">
              <view style="width: 60px;">
                <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="e => wxAvatar = e.detail.avatarUrl">
                  <image class="avatar" :src="wxAvatar"/>
                </button>
              </view>
            </van-cell>
            
            <van-field :value="wxNickname" type="nickname" name="nickname" center clearable label="昵称"
              placeholder="设置您的昵称" :border="false" @blur="e => this.wxNickname = e.detail.value" use-button-slot>
            </van-field>
          </van-cell-group>
          
          <button type="primary" style="width: 60vw; margin: 10px auto" form-type="submit">确认</button>
        </form>
      </van-popup>
      <view style="z-index: 1;">
         <van-checkbox :value="isAgree" icon-size="15px" @change="e => isAgree = !isAgree">
           <view style="font-size: 14px;">我已阅读并同意服务协议</view>
         </van-checkbox>
       </view>
    </view> 
  </view>
</template>

<script> 
import { mapActions } from 'vuex'
import { defaultAvatarUrl } from '../../common/js/common.js'
import md5 from 'js-md5'
export default {
  data() {
    return {
      isAgree: true,
      token:'',  //账号密码登录返回的token
      
      wxtoken:'' ,//微信登录返回的openid
      showWxAuth: false,
      wxNickname: '',
      wxAvatar: defaultAvatarUrl,
      loginForm: {
        username: '',
        password: '',
      },
      registerForm: {
        userName: '',
        password: '',
        passwordAgain: ''
      },
      current:1,
      codeText:'获取验证码',
      counting:false,
      avatarUrl: defaultAvatarUrl,
    }
  },
  onLoad() {
    this.wxtoken = wx.getStorageSync('wxtoken')
    console.log(this.wxtoken)
    this.token = wx.getStorageSync('token')
    if(this.wxtoken || this.token) {
      wx.reLaunch({ url: '/pages/user/user' })
    } 
  },
  methods: {
    ...mapActions({
      registerUser: 'user/registerUser',
      userLogin: 'user/userLogin',
    }),
    changeTab(e) {
      this.current = e.currentTarget.dataset.code
      Object.keys(this.registerForm).forEach(key=>{this.registerForm[key]=''})
      Object.keys(this.loginForm).forEach(key=>{this.loginForm[key]=''})
    },
    //获取验证码 
    getCode(){
      if (!this.counting) {
        wx.showToast({ title: '验证码已发送', })
        //开始倒计时60秒
        this.countDown(60);
      } 
    },
    //倒计时60秒
    countDown(count){
      if (count == 0) {
        this.codeText = '获取验证码'
        this.counting=false
        return;
      }
      this.codeText = count + '秒后重新获取'
      this.counting=true
      setTimeout(() => {
        count--;
        this.countDown(count);
      }, 1000);
    },
    quitWxAuth() {
      this.showWxAuth = false
      this.wxtoken = ''
    },
    handleWxAuth() {
      wx.showLoading() 
     
      wx.getSetting({
        success: res => {
          if(!this.isAgree) {
            return wx.showToast({ title: '请勾选服务协议', icon: 'error' })
          }
          if(!res.authSetting['scope.userInfo']) {
            return wx.showToast({ icon: 'error', title: '微信登录失败!'})
          }
          if(this.wxtoken) {
            return wx.reLaunch({ url: '/pages/user/user' })
          }
          wx.login({
            success: res => {
              wx.request({
                url: `${this.config.baseUrl}/api/wechat/auth`,
                method: 'GET',
                data: { code : res.code },
                success: res => {        
                  if(res.data.code !== 200) {
                    return wx.showToast({ icon: 'error', title: '微信登录未授权!'})
                  }
                  wx.hideLoading();
                  wx.setStorage({ key:'token', data:'' })
                  this.wxtoken = res.data.data[0].wxtoken
                  wx.setStorage({ key:'wxtoken', data:this.wxtoken })
                  this.showWxAuth = true
                },  
              }) 
            } 
          })   
        },
        fail: rej => { 
          console.log('请授权登录');
          wx.setStorage({
            key:'wechatAuthorized',
            data: false
          }) 
        }
      })
    },
    // 提交昵称和头像
    handleWxLogin(e) {
      wx.request({
        url: `${this.config.baseUrl}/api/user/wechat`,
        method: 'POST',
        data: {
          name: this.wxNickname,
          avatar: this.wxAvatar,
          wxtoken: this.wxtoken,
        },
        success: (res) => {
          if (res.data.code !== 200) {
            wx.showToast({ icon: 'error', title: '微信登录失败!' })
            return
          }
          wx.setStorage({ key: 'wxtoken', data: res.data.data.wxtoken })
          wx.reLaunch({ url: '/pages/user/user' })
        },
        fail: (err) => { console.log(err) }
      });
    },
    back() {
      wx.navigateTo({ url: '/pages/login/login'  })
    },
    // 提交账号密码登录
    handleLogin() {
      // console.log(e.detail)
      if(this.loginForm.username === '') {
        return wx.showToast({ icon: 'error', title: '请输入手机号', mask: true, })
      }
      if(this.loginForm.password === '') {
        return wx.showToast({ icon: 'error', title: '请输入密码', mask: true, })
      } 
      wx.showLoading({ title: '正在登录', mask: true })
      this.userLogin({ token: this.loginForm.username, mode: 'normal' })
      .then(res => {
        console.log(res)
        if(res.code !== 200) {
          return wx.showToast({ icon: 'error', title: '登录失败!'}); 
        }
        wx.hideLoading()
        wx.setStorage({ key:'wxtoken', data:'' })
        wx.setStorage({ key:'token', data: res.data.token }) 
        wx.reLaunch({ url: '/pages/user/user' })
      })
    },
    
    handleRegister(e) {
      if(this.registerForm.userName === '') {
        return this.$utils.showToast('请输入手机号','error')
      }
      if(this.registerForm.password === '') {
        return this.$utils.showToast('请输入密码','error')
      } 
      if (this.registerForm.password !== this.registerForm.passwordAgain) {
        return this.$utils.showToast('两次密码不一致','error')
      }
      wx.showLoading({ title: '注册中', mask: true })
      this.registerUser({
        userName: this.registerForm.userName,
        password: this.registerForm.password,
        token: md5(this.registerForm.userName),
        role: 'user'
      }).then(res=> {
        if(res.code !== 200) {
          return this.$utils.showToast('此账号已被注册','error',2000)
        }
        this.$utils.showToast('注册成功','success',2000,null,null,() => {
          this.current = 1
        })
        wx.hideLoading()
      })
    }
  }
}
</script>

<style>
.main {
  height: 100vh;
   background-color: white;
   /* background-image: linear-gradient(#44ADFB,#5ed6fd); */
    margin: 0;  
    padding: 0;
}
.header {
  display: flex;
  /* align-items: center; */
  height: 30%; 
  padding: 66px 30px 10px;  
  color: white;
  font-weight: bold;
  font-size: 20px;
  background-image: linear-gradient(#44ADFB,#5ed6fd);
}

/* 内容 */
.center-box{
  background-color: white;
  margin: -15vh 20rpx 0 20rpx;
  padding: 25rpx;
  z-index: 999;
  border-radius: 15rpx;
  -webkit-filter: drop-shadow(0 0 8rpx #44ADFB);
  filter: drop-shadow(0 0 8rpx #44ADFB);
}
/* 导航 */
.nav{
  display: flex;
  text-align: center;
  font-size: 32rpx;
  margin-bottom: 8%;
}
.left{
  flex: 1;
  font-weight: bold;
}
.right{
  flex: 1;
  font-weight: bold;
}
.select{
  font-weight: bold;
  color: #33ccff;
}
.select text{
  padding-bottom: 5rpx;
  border-bottom-left-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
  border-bottom: 5rpx solid #33ccff;
}

.sumbit-btn{
  margin: 6% 30rpx 30rpx 30rpx;
}
.btn {
  background-color: #33ccff;
  font-size: 30rpx;
}
/* 重影 */
.shadow{
  box-shadow: 0rpx 0rpx 10rpx 0rpx #44ADFB;
  border-radius: 25rpx;
  background-color: white;
}
.shadow-1{
  height: 40rpx;
  margin: -20rpx 50rpx 0 50rpx;
}
.shadow-2{
  position: relative;
  z-index: -888;
  height: 50rpx;
  margin: -30rpx 80rpx 0 80rpx;
}
.bottom-box{
  position:fixed; 
  bottom: 5vh;
  width:100%;
  font-size: 24rpx;
  color: gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.wechat {
  margin-bottom: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #09bb07;
}
</style>

<style scoped>
/* index.wxss  参考 */
 .title {
  margin-top: 5vh;
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}
.msg {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
.avatar-wrapper {
  padding: 0;
  width: 60px !important;
  border-radius: 8px;
  background-color: #fff;
}

.avatar {
  display: block;
  width: 60px;
  height: 60px;
}
</style>