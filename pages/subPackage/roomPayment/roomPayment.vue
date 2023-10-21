<template>
  <view>
    <scroll-view 	scroll-y style="padding-bottom: 20vw;">
     <van-nav-bar
        :title="roomDetail.name || ''"
        left-arrow
        fixed
        z-index="99"
        placeholder
        @click-left="back"
        custom-style="background-color: var(--navbar-color)"
      ></van-nav-bar>
        
      <u-notice-bar text="30分钟内可免费取消" mode="closable"></u-notice-bar>
      <van-cell-group inset>
        <van-cell>
          <view slot="title" style="padding: 2vw; background-color: white;" >
            <view style="font-weight: bold;">{{ hotelCondition.checkInRange[0] }}——{{ hotelCondition.checkInRange[1]}}</view>
            <van-tag type="primary">{{roomDetail.roomType}}</van-tag>
            <view>{{ hotelCondition.checkInNum }}人入住</view>
          </view>
        </van-cell>
        <van-cell title="最早入住时间" use-label-slot>
          <view slot="right-icon">{{ hotelCondition.checkInRange[0] }}{{ roomDetail.checkTime }}后</view>
        </van-cell>
      </van-cell-group>
          
      <van-cell-group inset title=" ">
        <van-cell  :border="false">
          <view slot="title" style="font-weight: bold; font-size: 16px;" >入住信息</view>
        </van-cell>
        <van-field
          :value="userInfo.name"
          label="姓名"
          placeholder="请输入住客姓名"
          input-align="right"
          @blur="e => userInfo.name = e.detail.value"/>
        <van-field
          :value="userInfo.phone"
          label="手机号码"
          type="number"
          placeholder="请输入手机号码"
          input-align="right"
          @blur="e => userInfo.phone = e.detail.value"/>
      </van-cell-group>
      
      <van-cell-group inset title=" ">
        <van-cell  :border="false">
          <view slot="title" style="font-weight: bold; font-size: 16px;" >优惠信息</view>
        </van-cell>
        <van-cell title="本单优惠" value="暂无" isLink/>
        <van-cell title="会员权益" value="暂无" isLink/>
      </van-cell-group>
      
      <van-cell-group inset title=" ">
        <van-cell  :border="false">
          <view slot="title" style="font-weight: bold; font-size: 16px;" >服务保障</view>
        </van-cell>
        <van-cell title="入住保障" value="入住后为住客购买意外险" isLink/>
        <van-cell title="开具发票" value="" isLink/>
        <van-cell title="退订保障" value="入住前一天免费退订" isLink/>
        <van-cell title="联系客服" value="" isLink/>
      </van-cell-group>
    </scroll-view>
    <!-- 结算栏 -->
    <van-submit-bar
      :price="roomDetail.price *100"
      button-text="提交订单"
      @submit="pay">
    </van-submit-bar>
  </view>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    onLoad(options) {
      this.userInfo = JSON.parse(wx.getStorageSync('userInfo')) 
      this.hotelCondition = JSON.parse(wx.getStorageSync('hotelCondition')) 
      this.roomDetail = JSON.parse(options.room)
      this.getRoom({ name: this.roomDetail.name, type: this.roomDetail.roomType }).then(res => {
        this.roomDetail = res[0]
      })
    },
    data() {
      return {
        roomDetail: {},
        userInfo: {},
        hotelCondition: {},
      }
    },
    methods:{
      ...mapActions({
        roomPayment: 'hotel/roomPayment',
        getRoom: 'hotel/getRoom'
      }),       pay() {
         this.roomPayment({
           roomDetail: this.roomDetail,
           userInfo: this.userInfo,
           checkCondition: this.hotelCondition
         }).then(res => {
           console.log(res)
          if(res.code === 200) {
            wx.navigateTo({
              url:'/pages/subPackage/paySuccess/paySuccess?order=' + JSON.stringify(res.data)
            })
          }
         })
       },
       back() {
          wx.navigateBack({ delta:2  })
      },       
    }
  }
</script>

<style lang="scss">

</style>
