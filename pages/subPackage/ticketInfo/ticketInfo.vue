<template>
  <view>
    <van-toast id="van-toast" />
    <van-nav-bar 
      title="我的" 
      fixed 
      left-arrow
      placeholder 
      @click-left="back"
      custom-style="background-color: var(--navbar-color)" 
      z-index="99">
    </van-nav-bar>

    <van-image
      width="100%"
      fit="widthFix"
      lazy-load
      :src="sceneData.image">
    </van-image>
    <van-cell-group>
      <van-cell use-label-slot>
        <view style="width: 100%; margin: 0 2vw;" slot="title">
          <van-tag mark type="primary">店铺</van-tag>
          <view>【安心游】{{sceneData.name}} / {{sceneData.description}}</view>
        </view>
        <view style="display: flex; justify-content: space-between;" slot="label">
          <view style="color: #cf0003; display: flex; align-items: center;">
            <text>￥</text><view style="font-size: 22px;">168-288</view>
          </view>
          <view>已售出1298</view>
        </view>
      </van-cell>
    </van-cell-group>

    <view class="ticket_list" slot="title">
     <van-tabs type="card" animated swiperable>
       
       <van-tab :title="cate.name" v-for="(cate,index) in ticketList" :key="index">
         <van-card
           v-for="(item,i) in cate.list"
           :key="i"
           :title="item.name"
           :desc="item.description"
           :price="item.price"
           :thumb="sceneData.image"
           thumb-mode="contain"
           custom-style="background-color: white;"
         >
           <view slot="num" style="text-align: right;">
            <van-button size="small" type="warning" @click="handleAddShopCart(item)" custom-style="border-radius: 20px 0 0 20px" color="#ffab1a"><van-icon name="shopping-cart-o" />加入购物车</van-button>
            <van-button size="small" type="info" @click="pay(item)"  custom-style="border-radius:  0 20px 20px 0" color="#f21d27"><van-icon name="bill-o" />立即购买</van-button>
           </view>
         </van-card>
         </van-tab>
       
     </van-tabs>
    </view>

    
     <van-cell-group title=" ">
       <van-cell>
         <view class="" slot="title">产品详情</view>
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
        sceneData: {},
        ticketList: [
          {name: '成人票', list: []},
          {name: '学生票', list: []},
          {name: '儿童票', list: []},
        ],
      };
    },
  
    onLoad(options) {
      this.userInfo = JSON.parse(wx.getStorageSync('userInfo'));
      this.sceneData = JSON.parse(options.sceneData) 
      this.getTickets({sceneName: this.sceneData.name}).then(res => {
        this.ticketList.forEach(item => {
          item.list = res.filter(element => element.type === item.name)
        })
      })
    },
    methods: {
      ...mapActions({
        getTickets: 'scenery/getTickets',
        addShopCart: 'order/addShopCart'
      }),
      handleAddShopCart(ticket) {
        ticket.amount = ticket.price
        this.addShopCart({
          type: '门票',
          scenery: this.sceneData,
          userInfo: this.userInfo,
          ticket,
          day: this.$dayjs().format('MM月DD日'),
          session: '上午场09:00',
          ticketNum: 1,
        }).then((res) => {
          if (res.code === 200) {
            this.$utils.Toast({
              type: 'success',
              message: '已加入购物车',
            })
          }
        });
      },
      pay(ticket) {
        const data = {
          ticket,
          scenery: this.sceneData
        }
        wx.navigateTo({
          url:"/pages/subPackage/ticketPayment/ticketPayment?data=" + JSON.stringify(data),
        })
      },
      back() {
        wx.navigateBack({
          delta:1
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // justify-content: space-between;
  margin: 0 2vw 5vw;
  height: 20vw;
}
.ticket_list {
  // height: fit-content;
  background-color: white;
  margin-top: 10px;
}
/deep/ .van-card {
  background-color: white;
}
</style>
