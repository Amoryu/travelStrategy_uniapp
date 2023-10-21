<template>
  <view>
    <van-nav-bar
       left-arrow
       @click-left="back"
       title="酒店预订"
       fixed
       placeholder
       custom-style="background-color: var(--navbar-color)"
       z-index="99"
     />
     <van-popup
       safe-area-inset-top
       :show="showAreaSelector"
       position="bottom"
       custom-style="height: 50vh;"
       @close="foldAreaSelector(true)"
     >  
       <van-area title="选择所在地" 
         :area-list="areaList" 
         :columns-num="3" 
         @confirm="changeArea"
         @cancel="closeAreaChange"/>
     </van-popup>
     
     <van-tabs>
       <van-tab title="酒店">
         <van-cell-group inset title=" ">
          <van-cell>
            <view slot="title" class="pd-5"  @click="foldAreaSelector(false)">
              <van-icon name="search" />
              <text style="color: blue; font-size: 16px; font-weight: bold; margin-left: 5px;">{{currentArea}}</text>
              </view>
            <view slot="right-icon"  class="pd-5" @click="getGPSPosition"><van-icon name="aim"/>获取当前定位</view>
          </van-cell>
          <van-cell>
            <view slot="title">
              <view @click="showCalendar">
                <van-icon name="clock-o"  class="pd-5"/>入离时间
              </view>
              <van-calendar
                position="bottom"
                :show="isShowCalendar"
                type="range"
                @close="showCalendar"
                @confirm="showCalendar"
              />         
            </view>
            <view slot="right-icon" style="color: blue" @click="showCalendar">{{checkInRange[0]}} - {{checkInRange[1]}}</view>
          </van-cell>
          
          <van-cell>
             <view slot="title" class="pd-5">
               <view ><van-icon name="friends-o"/>入住人数：<text style="color: blue">{{checkInNum}}</text></view>
            </view>
            <view slot="right-icon"><van-stepper :value="checkInNum" min="1" max="4" integer @minus="checkInNum--" @plus="checkInNum++"/></view>
          </van-cell>
          <van-button type="primary" color="#172e6a" size="large" @click="toPage('酒店')">查找酒店</van-button>
        </van-cell-group>
       </van-tab>
            
     </van-tabs>
  </view>
</template>

<script>
  import { getLocationInfo } from '../../../common/js/common.js'
  import { areaList } from '@vant/area-data';
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        showAreaSelector: false,
        areaList,
        position: '',
        currentArea: '',
        isShowCalendar: false,
        showMember: false,
        checkInNum: 1,
        checkInRange: [
          `${new Date().getMonth() + 1}月${new Date().getDate()}日`,
          `${new Date().getMonth() + 1}月${new Date().getDate() + 1}日`]
      };
    },
    async onLoad() {
      this.getCurrentArea().then(res => {
        let result = res[0]
         this.currentArea = result.area
          ? result.area 
          : result.city 
              ? result.city 
              : result.province ? result.province : '北京市朝阳区'
      })
    },
    methods:{
      ...mapActions({
         getCurrentArea: 'common/getCurrentArea',
      }),
      async getGPSPosition() {
        const location = await getLocationInfo();
        this.currentArea = location.city + location.area + location.street
      },
      back() {
        wx.navigateBack({
          delta: 2
        })
      },
      showCalendar(e) {
        this.isShowCalendar = !this.isShowCalendar
        if(!this.isShowCalendar && e.detail) {
          this.checkInRange[0] = `${e.detail[0].getMonth() + 1}月${ e.detail[0].getDate()}日`
          this.checkInRange[1] = `${e.detail[1].getMonth() + 1}月${ e.detail[1].getDate()}日`
          console.log(this.checkInRange)
        }
      },
      foldMember(state) {
        this.showMember = !this.showMember
      },
      toPage(page) {
        const searchCondition = {
          page,
          currentArea: this.currentArea,
          checkInNum: this.checkInNum,
          checkInRange: this.checkInRange
        }
        wx.setStorage({
          key: 'hotelCondition',
          data: JSON.stringify(searchCondition)
        })
        wx.navigateTo({
          url: '/pages/subPackage/hotelList/hotelList?search='+JSON.stringify(searchCondition)
        })
      },
      foldAreaSelector(state) {
        this.showAreaSelector = !state
      },
      changeArea({detail}) {
        const curArea = {
          province: detail.values[0].name,
          city: detail.values[1].name,
          area: detail.values[2].name,
        }
        this.currentArea = curArea.city + curArea.area
        this.showAreaSelector = false
      },
      closeAreaChange() {
        this.showAreaSelector = false
      }
    }
  }
</script>

<style lang="scss">
.hotel {
  margin-top: 20vw;
}
</style>
