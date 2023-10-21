<template>
  <view style="height: 100vh">
    <van-nav-bar title="支付" fixed z-index="99" />
    <!--WXML示例代码-->
    <mp-msg type="success" title="支付成功" ext-class="container">
      <view slot="desc" style="width: 90vw; margin: 0 4vw">
        <view style="font-weight: bold">
          订单号：
          <text style="font-weight: 100">{{ orderDetail.orderNo }}</text>
        </view>
      </view>
      <view slot="extend" style="width: 90vw; margin: 0 4vw">
        <view class="row">
          <view style="font-weight: bold">订单名称：</view>
          <text style="font-weight: 100">{{ orderDetail.name }}</text>
        </view>
        <view class="row">
          <view style="font-weight: bold">收款商家：</view>
          <text style="font-weight: 100">{{ orderDetail.seller }}</text>
        </view>
        <view class="row">
          <view style="font-weight: bold">付款金额：</view>
          <text style="font-weight: 100">￥{{ orderDetail.amount }}.00</text>
        </view>
        <view class="row">
          <view style="font-weight: bold">创建时间：</view>
          <text style="font-weight: 100">{{ orderDetail.createTime }}</text>
        </view>
      </view>
      <view slot="handle">
        <button class="weui-btn" type="primary" @click="backToHome">返回首页</button>
        <button class="weui-btn" type="default" @click="toMyOrder">查看订单</button>
      </view>
    </mp-msg>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        orderDetail: {},
      };
    },
    onLoad(options) {
      this.orderDetail = JSON.parse(options.order);
      console.log(this.orderDetail)
    },
    methods: {
      toMyOrder() {
        wx.reLaunch({
          url: '/pages/subPackage/myOrder/myOrder',
        });
      },
      backToHome() {
        wx.switchTab({
          url: '/pages/scenery/scenery',
        });
      },
    },
  };
</script>

<style lang="scss">
  .container {
    width: 100vw;
    height: 100vh;
  }
  .row {
    margin: 2vw 0;
    display: flex;
    justify-content: space-between;
  }
</style>
