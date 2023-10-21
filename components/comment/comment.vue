<template>
  <view>
    <view style="display: flex;">
    <van-image
      round
      width="25px"
      height="25px"
      src="/static/assets/logo.png"
    />
    <view>
      <view class="username">热心市民庄先生</view>
      <view class="comment_content">这是一条评论</view>
    </view>
  </view>
  <van-divider
    contentPosition="center"
    customStyle="font-size: 14px;"
  >1小时前</van-divider>
  </view>

</template>

<script>
  export default {
    name:"comment",
    data() {
      return {
        
      };
    }
  }
</script>

<style lang="scss">
.username {
  margin-left: 10px;
  font-weight: 400;
  color: royalblue;
}
.comment_content {
  margin: 6px;
  width: 100%;
  padding: 2px 6px;
  background-color: #f0f5f8;
  border-radius: 5px;
}
</style>