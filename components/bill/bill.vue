<template>
  <view>
   <van-card
     :tag="billData.type || ''"
     :price="billData.amount|| ''"
     :desc="createTime || ''"
     :title="billData.seller || ''"
     :thumb="billData.coverImg || ''"
     lazy-load
     thumb-mode="contain"
   >
     <view slot="footer">
       <van-button round v-if="billData.state === '1'">去支付</van-button>
       <van-button round v-if="billData.state === '2'">去消费</van-button>
       <van-button round v-if="billData.state === '3'">已退款</van-button>
       <van-button round v-if="!['1','2','3'].includes(billData.state)">去评价</van-button>
     </view>
   </van-card>
  </view>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    name:"bill",
    props: {
      billData: {
        type: Object,
        default: () => {}
      }
    },
    computed:{
      createTime() {
        return `订单创建时间：${this.billData.createTime}`
      }
    },
    data() {
      return {
        category: [],
      };
    },
    onLoad() {
      this.currentType = 'all'
    },
    methods:{
   
    }
  }
</script>

<style lang="scss"></style>