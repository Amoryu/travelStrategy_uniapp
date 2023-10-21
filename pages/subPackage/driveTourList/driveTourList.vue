<template>
  <view>
    <van-nav-bar
      title="自驾游" 
      z-index="99" 
      left-arrow
      fixed 
      placeholder 
      @click-left="back"
      custom-style="background-color: var(--navbar-color)">
    </van-nav-bar>
    
    <van-grid direction="horizontal" column-num="3" custom-class="grid" clickable>
      <van-grid-item icon="bookmark-o" link-type="navigateTo" url="/pages/subPackage/driveTour/driveTour" text="当前城市" />
      <van-grid-item icon="hot-o" link-type="navigateTo" url="/pages/subPackage/driveTour/driveTour" text="经典路线" />
      <van-grid-item icon="photo-o" link-type="navigateTo" url="/pages/subPackage/driveTour/driveTour" text="自驾指南" />
    </van-grid>

    <van-tabs lazy-render animated custom-class="tabs">
     <van-tab v-for="(type,index) in tourType" :key="index" :title="type.name">
        <view class="drive" v-for="(item, i) in getDurationType(type)" :key="i" 
              @click="toRouteDetail(item.tour_steps)">
          <van-image lazy-load radius="5px" width="100%" height="100%" :src="item.tour_cover" />
            <view class="title">{{item.tour_name}}</view>
          </van-image>
        </view>
      </van-tab>
    </van-tabs>
    
  </view>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        tourCate: [],
        tourType: [
          { name: '1-2天自驾', duration: [1,2] },
          { name: '3-5天自驾', duration: [3,5] },
          { name: '7天以上自驾', duration: [7,31] },
        ]
      };
    },
    onShow() {
      this.getTourRoute().then(res => {
        let cate = res.map(item => item.tour_name)
        cate = [...new Set(cate)]
        
        this.tourCate = cate.map(item => 
          ({
            tour_name: item,
            tour_cover: res.find(step => step.tour_name === item).tour_cover,
            tour_steps: res.filter(step => step.tour_name === item),
            duration: res.find(step => step.tour_name === item).duration
           })
          )
        
      })
    },
    
    methods:{
      ...mapActions({
        getTourRoute:'common/getTourRoute'
      }),
      getDurationType(type) {
        return this.tourCate.filter(tour => tour.duration >= type.duration[0] && tour.duration <= type.duration[1])
      },
      toRouteDetail(steps) {
        wx.navigateTo({
          url: '/pages/subPackage/driveTour/driveTour?steps='+JSON.stringify(steps)
        })
      },
      back() {
        wx.navigateBack({
          delta: 1
        })
      }
    }
  }
</script>

<style lang="scss">
.tabs{
  margin-top: 10px;
}
.grid {
  // margin: 10px;
}
.drive{
  position: relative;
  width: 96vw;
  height: 50vw;
  margin: 2vw;
  .title {
    padding: 2vw;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 95%;
    height: 10vw;
    backdrop-filter: blur(3px);
    border: 1px solid #eee;
    font-size: 24px;
    font-weight: bold;
    color: white;
  }
}
</style>
