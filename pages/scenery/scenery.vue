<template>
  <scroll-view type="custom">
    <van-dialog id="van-dialog" />
    <van-popup safe-area-inset-top :show="showAreaSelector" position="bottom" custom-style="height: 50vh;" @close="foldAreaSelector(true)">
      <van-area title="选择所在地" :area-list="areaList" :columns-num="3" @confirm="changeArea" @cancel="e => showAreaSelector = false" />
    </van-popup>

    <van-nav-bar :title="isSearch ? '搜索':'景点'" fixed placeholder custom-style="background-color: var(--navbar-color);" z-index="99">
      <div v-if="!isSearch" slot="left" style="display: flex; align-items: center" @click="foldAreaSelector(false)">
        <van-icon name="map-marked" color="white" size="20px"></van-icon>
        <view style="font-size: 16px; color: white; margin-left: 5px">{{currentArea}}</view>
      </div>
      <div v-else slot="left" style="display: flex; align-items: center" @click="backToScenery">
        <van-icon name="arrow-left" color="white" size="20px"></van-icon>
      </div>
    </van-nav-bar>

    <van-search
      @focus="e => isSearch = true"
      @clear="backToScenery"
      shape="round"
      :value="keyword"
      placeholder="请输入搜索关键词"
      use-action-slot
      @change="e => keyword = e.detail">
      <view slot="action" @click="search" style="margin: 0 15px; font-size: 16px; border-radius: 5px">搜索</view>
    </van-search>

    <van-transition :show="!isSearch" name="slide-right">
      <swiper
        indicator-dots
        autoplay
        circular
        indicator-active-color="rbga(255,255,255,.8)"
        indicator-color="rgba(0,0,0,.3)"
        interval="3000"
        style="width: 100vw; height: 40vw">
        <swiper-item v-for="item in swiperPicList" :key="item.id" style="height: 40vw">
          <image :src="item.img_src" style="width: 100vw"></image>
        </swiper-item>
      </swiper>

      <view class="order">
        <van-grid gutter="20" :border="false">
          <van-grid-item use-slot v-for="(item,index) in orderList" :key="index" @click="toTicketsPage(item.page)">
            <view class="tac">
              <image :src="item.imgSrc" class="icon"></image>
              <view style="font-size: 12px">{{ item.name }}</view>
            </view>
          </van-grid-item>
        </van-grid>
      </view>

      <view class="adv">
        <van-grid clickable column-num="3">
          <van-grid-item icon="good-job-o" link-type="navigateTo" url="/pages/subPackage/billBoard/billBoard" text="专属推荐" />
          <van-grid-item icon="medal-o" link-type="navigateTo" url="/pages/subPackage/billBoard/billBoard" text="打卡排行榜" />
          <van-grid-item icon="logistics" link-type="navigateTo" url="/pages/subPackage/driveTourList/driveTourList" text="自驾路线" />
        </van-grid>
      </view>

      <van-tabs sticky :ellipsis="false">
        <van-tab title="推荐">
          <list-view>
            <van-card
              @click.native="toDetail(item.id)"
              v-for="(item,i) in sceneList"
              :key="i"
              tag="景区/场馆"
              :desc="item.description"
              desc-class="ellipsis"
              custom-class="card"
              :title="item.name"
              :thumb="item.image"
              lazy-load></van-card>
          </list-view>
        </van-tab>
        <van-tab title="小众景点">小众景点</van-tab>
        <van-tab title="宝藏小城">宝藏小城</van-tab>
        <van-tab title="古镇漫游">古镇漫游</van-tab>
      </van-tabs>
    </van-transition>

    <van-transition :show="isSearch" name="slide-right">
      <van-empty v-if="!searchResult.length" image="search" description="搜索内容为空">
        <van-button round plain type="info" custom-style="width: 140px;" @click="backToScenery">返回</van-button>
      </van-empty>
      <list-view v-else>
        <van-card
          v-for="(item,index) in searchResult"
          :key="index"
          :title="item.name"
          :thumb="item.image"
          :desc="item.description"
          custom-class="card"
          desc-class="ellipsis"
          tag="景区"
          @click.native="toSearchResult(item)"></van-card>
      </list-view>
    </van-transition>
  </scroll-view>
</template>

<script>
  import { mapActions } from 'vuex';
  import { areaList } from '@vant/area-data';
  import { getLocationInfo, orderList } from '../../common/js/common.js';
  import Cover from '../../components/cover/cover.vue';
  export default {
    components: { Cover },
    data() {
      return {
        isSearch: false,
        searchResult: [],
        keyword: '',
        GPSPosition: '',
        currentArea: '',
        areaList,
        showAreaSelector: false,
        sceneList: [],
        swiperPicList: [],
        orderList,
      };
    },
    onPullDownRefresh() {
      this.initData('refresh')
    },
    onLoad() {
      this.initData()
    },
    async onShow() {
      const location = await getLocationInfo();
      this.GPSPosition = location.city + location.area + location.street;
      this.checkOpenGPSServiceByAndroid(location);
    },
    methods: {
      ...mapActions({
        getSwiper: 'common/getSwiper',
        getScene: 'scenery/getScene',
        getCurrentArea: 'common/getCurrentArea',
        changeCurrentArea: 'common/changeCurrentArea',
        getSearchScene: 'scenery/getSearchScene',
      }),
      async initData(operation) {
        await this.getSceneList();
        await this.getCurArea();
        this.swiperPicList = await this.getSwiper()
        operation === 'refresh' && wx.stopPullDownRefresh();
      },
      toDetail(id) {
        const sceneData = this.sceneList.find((item) => item.id === id);
        wx.navigateTo({
          url: '/pages/subPackage/ticketInfo/ticketInfo?sceneData=' + JSON.stringify(sceneData),
        });
      },
      toTicketsPage(page) {
        wx.navigateTo({  url: page });
      },
      backToScenery(e) {
        this.isSearch = false;
        this.keyword = '';
        this.searchResult = [];
      },
      toSearchResult(sceneData) {
        wx.navigateTo({
          url: '/pages/subPackage/ticketInfo/ticketInfo?sceneData=' + JSON.stringify(sceneData),
        });
      },

      search(e) {
        this.getSearchScene({ search: this.keyword }).then((res) => {
          this.searchResult = res.code === 200 ? res.data : [];
        });
      },
      getCurArea() {
        this.getCurrentArea().then(res => {
          let result = res[0];
          this.currentArea = result.area ? result.area : result.city ? result.city : result.province ? result.province : '北京';
        });
      },
      async getSceneList() {
        this.sceneList = await this.getScene()
      },
      foldAreaSelector(state) {
        this.showAreaSelector = !state;
      },
      changeArea({ detail }) {
        const curArea = {
          province: detail.values[0].name,
          city: detail.values[1].name,
          area: detail.values[2].name,
        };
        this.changeCurrentArea(curArea).then((res) => {
          this.getCurArea();
          wx.showToast({
            title: `切换为:${res.area ? res.area : res.city ? res.city : res.province ? res.province : '北京'}`,
            mask: true,
          });
        });
        this.showAreaSelector = false;
      },
      checkAuthToGPS() {
        //手机定位服务（GPS）已授权
        if (res.hostName == 'WeChat') {
          //2、判断微信小程序是否授权位置信息
          uni.getSetting({
            success(res) {
             let scopeUserLocation = res.authSetting['scope.userLocation'];
              if (scopeUserLocation) {
                // 微信小程序已授权位置信息
                that.getCurrent();
              } else {
                // 微信小程序未授权位置信息
                uni.showModal({
                  title: '提示',
                  content: '请允许使用位置信息',
                  showCancel: false, // 不显示取消按钮
                  success: () => { uni.navigateBack({ delta: 1 }) },
                });
              }
            },
            fail() {
              // 微信小程序未授权位置信息
              uni.showModal({
                title: '提示',
                content: '获取位置信息失败',
                showCancel: false, // 不显示取消按钮
        	      success: () => { uni.navigateBack({ delta: 1 }) },
              });
            },
          });
        } else {
        }
      },
      //判断用户是否开启定位-暂时不用
      checkOpenGPSServiceByAndroid(location) {
      		let that = this;
        // 1、判断手机定位服务【GPS】 是否授权
        uni.getSystemInfo({
          success(res) {
      			   // console.log(res)
            let locationEnabled = res.locationEnabled; //判断手机定位服务是否开启
      		  let locationAuthorized = res.locationAuthorized; //判断定位服务是否允许微信授权

            if (locationEnabled && that.currentArea !== location.area) {
              that.$utils.Dialog.confirm({
                title: '切换位置',
                message: `检测到您的位置发生变化,
                     是否切换为当前位置:${that.GPSPosition}`,
              }).then(() => {
                  // on confirm
                  that.currentArea = location.area;
                  that.changeCurrentArea({
                    province: location.province,
                    city: location.city,
                    area: location.area,
                  }).then((res) => {
                    that.getCurArea();
                    wx.showToast({ title: `切换成功`, mask: true, });
                  });
                }).catch(() => { });
            }
          },
          fail() {
            // 手机定位服务（GPS）未授权
            uni.showModal({
              title: '提示',
              content: '获取位置信息失败',
      			  showCancel: false, // 不显示取消按钮
              success: () => { uni.navigateBack({ delta: 1 }) },
            });
          },
        });
      },
    },
  };
</script>

<style lang="scss">
  /* pages/strategy/strategy.wxss */
  .order {
    /* width: 100vw; */
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: fit-content;
    border: #d7dbdd 1px solid;
    margin: 2vw 2vw;
    background-color: white;
    border-radius: 6px;
    box-shadow: #ddd 5px 5px 4px;
  }

  .icon {
    width: 14vw;
    height: 14vw;
    background-color: skyblue;
    border-radius: 8px;
    margin-bottom: 4px;
  }
  .adv {
    height: fit-content;
    margin: 2vw 2vw;
    box-shadow: #d7dbdd 5px 5px 5px;
  }
  .card {
     margin:2px 4px;
     box-sizing: border-box; 
     box-shadow: #ccc 5px 5px 5px;
  }
  .search {
    height: 30px;
  }
</style>
