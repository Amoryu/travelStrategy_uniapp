<template>
  <view style="position: relative;">
    <!-- navBar -->
    <van-nav-bar
      title="我的订单"
      left-arrow
      @click-left="back"
      fixed
      z-index="99"
      placeholder
      custom-style="background-color: var(--navbar-color)"
    ></van-nav-bar>

    <!-- 顶部标签栏 -->
    <van-tabs>
      <van-tab :title="cate.name" v-for="(cate,index) in category" :key="index">
        <van-empty v-if="cate.list.length === 0" image="search" description="内容为空" />
        <list-view v-else>
          <bill v-for="(item,i) in cate.list" :key="i" :billData="item" :type="cate.type"></bill>
        </list-view>
      </van-tab>
    </van-tabs>

  </view>
</template>

<script>
import { mapActions } from 'vuex'
import bill from "@/components/bill/bill.vue"
export default {
  components: { bill },
  data() {
    return {
      total: true,
      active: 1,
      category: [
        {name:'全部',list: []},
        {name:'待支付',list: []},
        {name:'待消费',list: []},
        {name:'取消/退款',list: []},
      ],
      userInfo: {}
    }
  },
  onLoad() {
    this.userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    this.getOrderList()
  },
  methods: {
    ...mapActions({
      getOrder: 'order/getOrder',
    }),
    back() {
      wx.switchTab({
        url:'/pages/shopCart/shopCart'
      })
    },
    getOrderList() {
      this.getOrder({ userToken: this.userInfo.token, userWxtoken: this.userInfo.wxtoken }).then(res => {
        console.log(res)
        res.forEach(element => {
            this.category[0].list.push(element)
            switch(element.state) {
              case '1':
              this.category[1].list.push(element)
                break;
              case '2':
              this.category[2].list.push(element)
                break;
              case '3':
              this.category[3].list.push(element)
                break;
            }
          })
        console.log(this.category)
      })
    },
  }
}
</script>

<style lang="scss">
.settlement {
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 8vh;
  background-color: white;
  border: 2px solid #eee;
}
</style>
