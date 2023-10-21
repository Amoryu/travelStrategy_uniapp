<template>
  <view style="position: relative">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="购物车" fixed z-index="99" placeholder custom-style="background-color: var(--navbar-color)">
      <van-icon name="goods-collect" color="white" size="22px" slot="left" @click="toOrderPage"/>
    </van-nav-bar>

    <!-- 侧边订单类型栏和内容区域 -->
    <view class="cate-list">
      <view class="left-nav">
        <van-sidebar :active-key="0" @change="tabChange">
          <van-sidebar-item v-for="(cate,index) in category" :key="index" :title="getCategotyName(cate.name)" :badge="cate.list.length" />
        </van-sidebar>
      </view>

      <view class="cate-body">
        <list-view>
          <Item
            v-for="item in (category || []).find(item => currentType === item.name).list"
            :key="item.id"
            :cartItem="item"
            @checkThis="checkThis"
            @changeCount="changeCount"
            @gotoDetail="gotoDetail"/>
        </list-view>
      </view>
    </view>

    <!-- 结算栏 -->
    <van-submit-bar v-if="checkedItem" :price="totalAmount * 100" button-text="提交订单" @submit="pay(checkedItem)" />
  </view>
</template>

<script>
  import { mapActions } from 'vuex';
  import Item from '../../components/item/item.vue';
  export default {
    components: { Item },
    data() {
      return {
        checkedItem: null,
        totalAmount: 0,
        currentType: '',
        category: [ 
          {name: 'ticket',list: []},
          {name: 'hotel',list: []},
        ],
        userInfo: {},
        seller: {},
      };
    },
    onShow(){
      this.initData();
    },
    onLoad() {
      this.initData();
    },
    methods: {
      ...mapActions({
        getShopCart: 'order/getShopCart',
        getHotel: 'hotel/getHotel',
        getSingleScene:'scenery/getSingleScene'
      }),
      initData() {
        this.userInfo = JSON.parse(wx.getStorageSync('userInfo'))
        this.getOrderList();
        this.currentType = 'ticket';
      },
      gotoDetail(orderDetail) {
        this.getSingleScene({ sceneryName: orderDetail.seller }).then(res => {
          const data = {
            scenery: res[0] ,
            ticket: orderDetail,
            count: orderDetail.count,
          }
          wx.navigateTo({
            url: orderDetail.type === '门票'
            ? "/pages/subPackage/ticketPayment/ticketPayment?data=" + JSON.stringify(data)
            : "/pages/subPackage/roomPayment/roomPayment?room=" + JSON.stringify(orderDetail)
          })
          
        })
        
      },
      pay(item) {
        this.gotoDetail(item)
      },
      checkThis(id, isCheck, itemCount) {
        console.log(id, itemCount)
        this.category.forEach((element) => {
          element.list.forEach((item) => {            
            item.isCheck = false
          });
        });
        
        this.category.forEach((element) => {
          element.list.forEach((item) => {
            if (item.id === id) {
              item.isCheck = isCheck;
              this.totalAmount = isCheck ? item.price * itemCount : 0;
              this.checkedItem = isCheck ? item : null
              console.log(isCheck, this.totalAmount, this.checkedItem)
            }
          });
        });
        
      },
      changeCount(id, itemCount) {
        this.category.forEach((element) => {
          element.list.forEach((item) => {
            if (item.id === id && item.isCheck) {
              this.totalAmount = item.price * itemCount
            }
          });
        });
      },

      tabChange(e) {
        this.currentType = ['ticket', 'hotel'][e.detail];
      },
      toOrderPage() {
        wx.navigateTo({
          url: '/pages/subPackage/myOrder/myOrder'
        })
      },
      getCategotyName: type => type === "ticket" ?  '门票' : '酒店',
      async getOrderList() {
        this.category = await this.getShopCart({ userToken: this.userInfo.token, userWxtoken: this.userInfo.wxtoken })
        this.category.forEach(element => {
          element.list.forEach(item => {
            item.isCheck = false;
          });
        });
      
      },
    },
  };
</script>

<style lang="scss">
  .cate-list {
    .left-nav {
      width: 20%;
      height: 100vh;
      position: fixed;
    }
    .cate-body {
      float: right;
      width: 80%;
      overflow: hidden;
      padding-bottom: 20vh;
    }
  }
</style>
