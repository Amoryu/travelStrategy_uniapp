<template>
  <view>
   <van-nav-bar
      left-arrow
      @click-left="back"
      :title="searchCondition.page"
      fixed
      placeholder
      custom-style="background-color: var(--navbar-color)"
      z-index="99"
    >
    </van-nav-bar>
    <grid-view type="masonry">
      <van-grid column-num="1">
        <van-card
          v-for="(item,index) in hotelList"
          :key="index"
          tag="酒店"
          :price="item.price || ''"
          :desc="item.description || ''"
          desc-class="ellipsis"
          :title="item.name || ''"
          :thumb="item.pictureList[0] || ''"
          @click.native="toHotelDetail(item)"
          lazy-load>
          
        <view slot="thumb">
          <van-image :src="item.picture || ''" width="22vw" height="22vw"></van-image>
        </view>
        </van-card>
      </van-grid-item>
      </van-grid>
    </grid-view>
  </view>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        searchCondition: {
          page: '酒店',
          currentArea: '北京',
          checkInNum: 1,
          checkInRange: [
            `${new Date().getMonth() + 1}月${new Date().getDate()}日`,
            `${new Date().getMonth() + 1}月${new Date().getDate() + 1}日`]
        },
        hotelList: []
      }; 
    },
    onLoad(options) {
      console.log(options.search)
      this.searchCondition = JSON.parse(options.search)
      this.getHotelList(this.searchCondition)
    },
    methods:{
      ...mapActions({
        getCurrentArea: 'common/getCurrentArea',
        getHotel: 'hotel/getHotel'
        
      }),
      back() {
        wx.navigateBack({
          delta:1
        })
      },
      getHotelList(search) {
        this.getHotel({ search }).then(res => {
          console.log(res)
          this.hotelList = res.map(item => {
            item.pictureList = item.pictureList.split('|')
            return item
          })
          console.log(this.hotelList)
        })
      },
      // 点击酒店
      toHotelDetail(hotel) {
        wx.navigateTo({
          url: '/pages/subPackage/hotelDetail/hotelDetail?hotelInfo='+JSON.stringify(hotel)
        })
      }
      
    }
  }
</script>

<style lang="scss">
</style>
