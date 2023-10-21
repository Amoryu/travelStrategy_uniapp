<template>
  <view style="position: relative;">
    <van-nav-bar
      title="自驾游路线" 
      z-index="99" 
      left-arrow
      @click-left="back"
      fixed 
      placeholder 
      custom-style="background-color: var(--navbar-color)"/>
    
    <view class="header">
      <view class="title">{{tourRouteName}}</view>
      <van-image lazy-load radius="5px" width="100%" height="100%" src="http://ruhf8tgea.hn-bkt.clouddn.com/tourCover/jingli.jpg" />
      </van-image>
    </view>
    
    
    <view class="tour_route">
      <van-tabs sticky ellipsis="false" >
        <van-tab title="路线总览">
          <van-steps
            :steps="steps"
            direction="vertical"
            active-color="#969799"
            desc-class="destination"
          />
        </van-tab>
        <van-tab title="每日行程">行程一</van-tab>
      </van-tabs>
    </view>
     
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        steps: [],
        tourRouteName: ''
      };
    },
    onLoad(options) {
      const steps = JSON.parse(options.steps)
      this.tourRouteName = steps[0].tour_name
      steps.forEach((item,index) => {
        this.steps.push({
          text: `DAY${index + 1}`,
          desc: steps.find(s => s.step_index === index + 1).step_title,
          inactiveIcon: 'flag-o',
          activeIcon: 'flag-o', 
        })
      })
    },
    methods:{ 
      back() {
        wx.navigateBack({
          delta: 1
        })
      }
    }
  }
</script>

<style lang="scss">
.tour_route{
  position: absolute;
  width: 100vw;
  top: 40vh;
  left: 0;
  z-index: 20;
  .destination {
    margin: 5px;
    height: 10vw;
    color: black;
    font-weight: bold;
    font-size: 18px;
  }
}
.header {
  position: relative;
  width: 100vw;
  height: 40vh;
  .title {
    color: white;
    font-weight: bold;
    font-size: 30px;
    width: 100vw;
    position: absolute;
    bottom: 20vh;
    left: 2vw;
    z-index: 10;
  }
}


</style>
