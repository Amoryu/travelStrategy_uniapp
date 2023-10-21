<template>
  <van-swipe-cell right-width="65">
    <view  class="checkbar">
      <van-checkbox :value="isCheck" icon-size="15px" @change="check(cartItem.id)">
        <view style="font-size: 14px; font-weight: bold">{{cartItem.seller}}</view>
      </van-checkbox>
    </view>

    <van-card
      :num="itemCount"
      :tag="cartItem.type || ''"
      :price="cartItem.price || 0"
      :desc="cartItem.order_desc || ''"
      :title="cartItem.name || ''"
      lazy-load
      custom-class="card">
      <view slot="thumb" @click="toDetail">
        <van-image :src="cartItem.coverImg || ''" width="22vw" height="22vw"></van-image>
      </view>
      <view slot="footer">
        <van-stepper v-model="itemCount" min="1" integer @blur="handleItemCount(cartItem,'input',$event)"  @minus="handleItemCount(cartItem,'minus')" @plus="handleItemCount(cartItem,'plus')" />
      </view>
    </van-card>
    <van-button slot="right" type="danger" custom-style="height:100%; padding:4vw;">删除</van-button>
  </van-swipe-cell>
</template>

<script>
  export default {
    props: {
      cartItem: {
        type: Object,
        default: () => {},
      },
    },
    created() {
      this.isCheck = this.cartItem.isCheck;
      this.itemCount = this.cartItem.count;
    },
    data() {
      return {
        isCheck: false,
        itemCount: 0,
      };
    },
    methods: {
      check(id) {
        this.isCheck = !this.isCheck;
        this.$emit('checkThis', id, this.isCheck, this.itemCount);
      },
      handleItemCount({ id }, type, e) {
        console.log(e)
        type === 'plus' && this.itemCount++;
        type === 'minus' && this.itemCount--;
        type === 'input' && (this.itemCount = e.detail.value)
        
        this.$emit('changeCount', id, this.itemCount);
      },
      toDetail(e) {
        this.$emit('gotoDetail', { ...this.cartItem, count: this.itemCount });
     },
    },
    watch: {
      cartItem: {
        deep: true,
        handler(oldVal, newVal) {
          this.isCheck = !newVal.isCheck;
        },
      },
    },
  };
</script>

<style lang="scss">
  .card {
    height: 21vh;
  }
  .checkbar {
    background-color: #fafafa;
    border-top: 1px solid #eee;
    padding: 2vw 4vw 0;
  }
</style>
