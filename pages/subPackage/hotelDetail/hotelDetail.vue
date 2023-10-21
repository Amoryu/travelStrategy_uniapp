<template>
  <view style="position: relative;">
    <van-toast id="van-toast" />
    <van-nav-bar left-arrow @click-left="back" fixed custom-style="background-color: transparent" z-index="99" />
    <swiper
      indicator-dots
      autoplay
      circular
      indicator-active-color="rbga(255,255,255,.8)"
      indicator-color="rgba(0,0,0,.3)"
      interval="3000"
       style="width: 100vw; height: 50vw;">
      <swiper-item v-for="(item, index) in hotelInfo.pictureList" :key="index" style="height: 50vw;">
        <image :src="item" style="width: 100vw;"></image>
      </swiper-item>
    </swiper>

    <van-cell-group>
      <van-cell>
        <view slot="title" style="padding: 2vw; background-color: white;" >
          <text style="font-size: 25px; font-weight: bole;">{{ hotelInfo.name }}</text>
          <view style="color: #e7e725;">
             <van-tag type="primary">{{ hotelInfo.description }}</van-tag>
          </view>
        </view>
      </van-cell>
    </van-cell-group>
    <van-collapse :value="collapseList" @open="foldFacility($event,'facility')" @close="foldFacility($event,'facility')">
        <van-collapse-item title="酒店设施" name="facility" icon="shop-o">
          <van-field type="textarea" autosize :value="hotelInfo.facility" readonly></van-field>
        </van-collapse-item>
        <van-collapse-item title="地址" name="address" icon="shop-o">
          <van-field :value="hotelInfo.address" readonly></van-field>
        </van-collapse-item>
    </van-collapse>
    
    <van-calendar
      position="bottom"
      :show="isShowCalendar"
      type="range"
      @close="showCalendar"
      @confirm="showCalendar"
    />  
    <van-cell-group title=" ">
      <van-cell>
        <view slot="title" style="color: blue" @click="showCalendar">{{checkInRange[0]}} - {{checkInRange[1]}}</view>
        <view slot="right-icon"><van-stepper :value="checkInNum" min="1" max="4" integer @minus="checkInNum--" @plus="checkInNum++"/></view>
      </van-cell>
    </van-cell-group>
    
    <van-cell-group title=" ">
      <van-cell>
        <view class="ticket_list" slot="title">
          <van-tabs type="card">
            <van-tab :title="cate" v-for="(cate, index) in roomType" :key="index">
              <van-card
                v-for="(item,i) in roomList.filter(room => room.roomType === cate)"
                :key="i"
                :title="item.name || ''"
                :desc="item.description || ''"
                :price="item.price"
                :thumb="item.coverImg"
              >
              <view slot="num" style="text-align: right;">
               <van-button size="small" type="warning" @click="handleAddShopCart(item)" custom-style="border-radius: 20px 0 0 20px" color="#f21d27"><van-icon name="shopping-cart-o" />加入购物车</van-button>
               <van-button size="small" type="info" @click="pay(item)"  custom-style="border-radius:  0 20px 20px 0" color="#1ab4e2"><van-icon name="bill-o" />现在预订</van-button>
              </view>
              </van-card>
            </van-tab>
          </van-tabs>
        </view>
      </van-cell>
    </van-cell-group>
    
  </view>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      userInfo: {},
      collapseList: [],
      hotelInfo: {},
      roomList: [],
      roomType: [],
      isShowCalendar: false,
      checkInRange: [
        `${new Date().getMonth() + 1}月${new Date().getDate()}日`,
        `${new Date().getMonth() + 1}月${new Date().getDate() + 1}日`
      ],
      checkInNum: 0,
      hotelCondition:{}
    }
  },
  onLoad(options) {
    this.userInfo = JSON.parse(wx.getStorageSync('userInfo'));
    this.hotelCondition = JSON.parse(wx.getStorageSync('hotelCondition')) 
    this.checkInRange = this.hotelCondition.checkInRange
    this.checkInNum = this.hotelCondition.checkInNum
    this.hotelInfo = JSON.parse(options.hotelInfo)
    console.log(this.hotelInfo)
    this.roomType = this.hotelInfo.roomType.split('|')
    this.getRoom({ hotelName: this.hotelInfo.name }).then(res => {
      console.log(res)
      this.roomList = res
    })

  },
  methods: {
    ...mapActions({
      getRoom: 'hotel/getRoom',
      addShopCart: 'order/addShopCart'
    }),
    back() {
      wx.navigateBack({
        delta: 1
      })
    },
    foldFacility(e,type) {
      console.log(e)
      this.collapseList = e.type === 'open' ? [e.detail] : []
    },
    showCalendar(e) {
      this.isShowCalendar = !this.isShowCalendar
      if(!this.isShowCalendar && e.detail) {
        this.checkInRange[0] = `${e.detail[0].getMonth() + 1}月${ e.detail[0].getDate()}日`
        this.checkInRange[1] = `${e.detail[1].getMonth() + 1}月${ e.detail[1].getDate()}日`
        console.log(this.checkInRange)
      }
    },
    handleAddShopCart(room) {
      this.addShopCart({
        type: '酒店',
        roomDetail: room, 
        checkCondition: {
          checkInRange: this.checkInRange,
          checkInNum: this.checkInNum
        }, 
        userInfo: this.userInfo,
      }).then((res) => {
        if (res.code === 200) {
          this.$utils.Toast({
            type: 'success',
            message: '已加入购物车',
          })
        }
      });
    },
    pay(room) {
      const hotelCondition = {
        checkInRange: this.checkInRange,
        checkInNum: this.checkInNum
      }
      // console.log('购买的房间',room)
      wx.setStorage({
        key: 'hotelCondition',
        data: JSON.stringify(hotelCondition)
      })
      wx.navigateTo({
        url:'/pages/subPackage/roomPayment/roomPayment?room='+JSON.stringify(room)
      })
    }
  }
}
</script>

<style lang="scss"></style>
