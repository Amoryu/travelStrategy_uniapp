<template>
  <view style="background-color: white; height: 40vw; border-radius: 10px; margin: 2vw;">
    <van-card
      :tag="'Top' + sceneData.rank"
      desc="距我72.6km"
      price="89"
      lazy-load
      :thumb="sceneData.picture"
    >
    <view slot="title" class="title">{{sceneData.scene_name}}</view>
    <view slot="footer" style="text-align: left; margin: 5px; background-color: #f0f5f8; padding: 4px; border-radius: 2px;">上榜原因：养生文化主题温泉</view>
    <van-rate slot="tags" value="4" color="#ffd21e" void-color="#ddd" allow-half></van-rate>
    <van-tag slot="bottom" plain color="#61afef">随订随用</van-tag>
    </van-card>
  </view>
</template>

<script>
  export default {
    name:"rankItem",
    props:{
      sceneData: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        
      };
    }
  }
</script>

<style lang="scss">

</style>