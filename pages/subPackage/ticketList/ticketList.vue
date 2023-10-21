<template>
  <view>
   <van-nav-bar
      left-arrow
      @click-left="back"
      title="门票"
      fixed
      placeholder
      custom-style="background-color: var(--navbar-color)"
      z-index="99">
    </van-nav-bar>
    <van-tabs sticky :ellipsis="false" offset-top="20" >
      <van-tab title="推荐">
        <!-- <grid-view type="masonry"> -->
          <!-- <van-grid column-num="1"> -->
            <van-card
              @click.native="toDetail(item.id)"
              v-for="(item,i) in sceneList"
              :key="i"
              tag="景区/场馆" 
              :desc="item.description"
              :thumb="item.image"
              custom-class="card"
              desc-class="ellipsis"
              :title="item.name"
              lazy-load>
              <!-- <view slot="thumb">
                <van-image :src="item.image" width="22vw" height="22vw"></van-image>
              </view> -->
            </van-card>
          <!-- </van-grid-item> -->
          <!-- </van-grid> -->
        </grid-view>
      </van-tab>
      <van-tab title="小众景点">小众景点</van-tab>
      <van-tab title="露营野餐">露营野餐</van-tab>
      <van-tab title="宝藏小城">宝藏小城</van-tab>
      <van-tab title="古镇漫游">古镇漫游</van-tab>
      <van-tab title="取景写生">取景写生</van-tab>
      <van-tab title="亲子出游">亲子出游</van-tab>
    </van-tabs>
  </view>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        sceneList: [],
      };
    },
    onLoad() {
      this.getSceneList()
      
    },
    methods:{
      ...mapActions({
        getSwiper: 'common/getSwiper',
        getScene: 'scenery/getScene',
        getCurrentArea: 'common/getCurrentArea',
        changeCurrentArea: 'common/changeCurrentArea',
        getTickets: 'scenery/getTickets'
      }),
      back() {
        wx.navigateBack({
          delta:2
        })
      },
      getSceneList() {
        this.getScene().then(res => {
          this.sceneList = res.filter(item => item.isOpen)
        })
      },
      toDetail(id) {
        const sceneData = this.sceneList.find(item => item.id === id)
        wx.navigateTo({
          url:"/pages/subPackage/ticketInfo/ticketInfo?sceneData="+JSON.stringify(sceneData),
        })
      }
    }
  }
</script>

<style lang="scss">
  .card {
     margin:2px 4px;
     box-sizing: border-box; 
     box-shadow: #ccc 5px 5px 5px;
  }
</style>
