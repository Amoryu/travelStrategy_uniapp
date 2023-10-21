<template>
  <view>
    <van-nav-bar
      title="打卡排行榜"
      left-arrow
      z-index="99"
      fixed
      placeholder
      @click-left="back"
      custom-style="background-color: var(--navbar-color)"
    >
      
    </van-nav-bar>
    <view style="line-height: 8vh; padding: 12px;" class="tac">
      <van-icon name="hot" size="120px" color="white"/>
      <view style="color: white; font-size: 20px; font-weight: bold;">打卡排行榜</view>
      <view style="color: white; font-size: 16px; font-weight: bold;">2023 {{GPSPosition.area}}榜</view>
    </view>
    <list-view style="width: 100vw; padding: 0 4vw; height: fit-content;">
      <rankItem v-for="item in billBoardList" :key="item.scene_id" :sceneData="item" @click.native="toRankItemDetail(item)"></rankItem>
      <rankItem v-for="item in billBoardList" :key="item.scene_id" :sceneData="item" @click.native="toRankItemDetail(item)"></rankItem>
      <rankItem v-for="item in billBoardList" :key="item.scene_id" :sceneData="item" @click.native="toRankItemDetail(item)"></rankItem>
      <rankItem v-for="item in billBoardList" :key="item.scene_id" :sceneData="item" @click.native="toRankItemDetail(item)"></rankItem>
      <rankItem v-for="item in billBoardList" :key="item.scene_id" :sceneData="item" @click.native="toRankItemDetail(item)"></rankItem>
    </list-view>
    
    
  </view>
</template>

<script> 
  import { mapActions } from 'vuex'
  import { getLocationInfo } from "../../../common/js/common.js"
  import rankItem from '@/components/rankItem/rankItem.vue'
  export default {
    components: { rankItem },
    data() {
      return {
        billBoardList: [],
        GPSPosition: ''
      }
    },
    async onLoad() {
      const location = await getLocationInfo()
      this.GPSPosition = {
        city: location.city,
        area: location.area,
        street:location.street
      }
      this.getBillBoard({ city: '北京' }).then(res=> {
        this.billBoardList = res
      })
    },
    methods:{
      ...mapActions({
        getBillBoard: 'common/getBillBoard'
      }),
      toRankItemDetail(sceneData) {
        wx.navigateTo({
          url:"/pages/subPackage/ticketInfo/ticketInfo?sceneData="+JSON.stringify(sceneData),
        })
      },
      back() {
        wx.navigateBack({
          delta: 1,
        });
      },
    }
  }
</script>

<style lang="scss">
</style>
