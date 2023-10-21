<template>
  <view>
    <van-toast id="van-toast" />
    <scroll-view scroll-y style="padding-bottom: 20vw">
      <van-nav-bar
        :title="sceneInfo.name || ''"
        left-arrow
        fixed
        z-index="99"
        placeholder
        @click-left="back"
        custom-style="background-color: var(--navbar-color)"/>

      <u-notice-bar text="30分钟内可免费取消" mode="closable"/>
      <van-cell-group inset>
        <van-cell>
          <view slot="title">
            <view style="font-weight: bold">{{ ticketInfo.name }}</view>
            <van-tag type="primary">{{ ticketInfo.type }}</van-tag>
          </view>
        </van-cell>
        <van-cell title="使用日期(当地时间)" :border="false" />
        <van-cell>
          <van-grid direction="horizontal" column-num="4" :border="false">
            <van-grid-item use-slot v-for="item in bookDay" :key="item.id">
              <view class="picktime" :class="item.selected ? 'actived' : ''" @click="pickDate(item)">{{ item.date }}</view>
            </van-grid-item>
          </van-grid>
        </van-cell>
        <van-cell title="场次时段" :border="false">
          <view slot="right-icon" style="display: flex">
            <view v-for="item in bookSession" :key="item.id" :class="item.selected ? 'actived' : ''" class="picksession" @click="pickSession(item)">
              {{ item.session }}
            </view>
          </view>
        </van-cell>
        <van-cell title="购买数量(限购10张)">
          <van-stepper
            slot="right-icon"
            :value="ticketNum"
            min="1" max="10" integer
            @blur="e => ticketNum = e.detail.value"
            @minus="ticketNum--"
            @plus="ticketNum++" />
        </van-cell>
      </van-cell-group>

      <van-cell-group inset title=" ">
        <van-cell :border="false">
          <view slot="title" style="font-weight: bold; font-size: 16px">游客信息</view>
        </van-cell>
        <van-field :value="userInfo.name" label="姓名" placeholder="请输入住客姓名" input-align="right" @blur="e => userInfo.name = e.detail.value" />
        <van-field
          :value="userInfo.phone"
          label="手机号码"
          type="number"
          placeholder="请输入手机号码"
          input-align="right"
          @blur="e => userInfo.phone = e.detail.value" />
      </van-cell-group>

      <van-cell-group inset title=" ">
        <van-cell :border="false">
          <view slot="title" style="font-weight: bold; font-size: 16px">优惠信息</view>
        </van-cell>
        <van-cell title="本单优惠" value="暂无" isLink />
        <van-cell title="会员权益" value="暂无" isLink />
      </van-cell-group>

      <van-cell-group inset title=" ">
        <van-cell :border="false">
          <view slot="title" style="font-weight: bold; font-size: 16px">保险</view>
        </van-cell>
        <van-cell title="景区意外险" isLink />
        <van-cell title="国内旅行险" isLink />
        <van-cell title="联系客服" isLink />
      </van-cell-group>
    </scroll-view>
    <!-- 结算栏 -->
    <van-submit-bar :price="ticketInfo.price * ticketNum * 100" button-text="提交订单" @submit="pay" :tip="true">
      <!-- <van-button color="linear-gradient(to right, #4bb0ff, #6149f6)" round @click="handleAddShopCart">加入购物车</van-button> -->
    </van-submit-bar>
  </view>
</template>

<script>
  import { mapActions } from 'vuex';
  export default {
    onLoad(options) {
      this.userInfo = JSON.parse(wx.getStorageSync('userInfo'));
      const data = JSON.parse(options.data);
      this.sceneInfo = data.scenery;
      this.ticketInfo = data.ticket;
      this.ticketNum = data.count || this.ticketInfo.count || 1;
      console.log(data.ticket);
      this.bookDay.forEach((item) => {
        if (item.date === data.ticket.bookDay) {
          item.selected = true;
        }
      });
      this.bookSession.forEach((item) => {
        if (item.session === data.ticket.bookSession) {
          item.selected = true;
        }
      });
    },
    data() {
      return {
        ticketNum: 1,
        sceneInfo: {},
        ticketInfo: {},
        userInfo: {},
        selectedDay: this.$dayjs().format('MM月DD日'),
        selectedSession: '上午场09:00',
        bookDay: [
          { id: 1, date: this.$dayjs().format('MM月DD日'), selected: false },
          { id: 2, date: this.$dayjs().add(1, 'day').format('MM月DD日'), selected: false },
          { id: 3, date: this.$dayjs().add(2, 'day').format('MM月DD日'), selected: false },
          { id: 4, date: this.$dayjs().add(3, 'day').format('MM月DD日'), selected: false },
        ],
        bookSession: [
          { id: 1, session: '上午场09:00', selected: false },
          { id: 2, session: '下午场09:00', selected: false },
        ],
      };
    },
    methods: {
      ...mapActions({
        ticketPayment: 'scenery/ticketPayment',
        addShopCart: 'order/addShopCart',
      }),
      pay(e) {
        this.ticketInfo.amount = this.ticketNum * this.ticketInfo.price;
        this.ticketPayment({
          scenery: this.sceneInfo,
          userInfo: this.userInfo,
          ticket: this.ticketInfo,
          day: this.selectedDay,
          session: this.selectedSession,
          ticketNum: this.ticketNum,
        }).then((res) => {
          if (res.code === 200) {
            wx.navigateTo({
              url: '/pages/subPackage/paySuccess/paySuccess?order=' + JSON.stringify(res.data),
            });
          }
        });
      },
      back() {
        wx.navigateBack({ delta: 2 });
      },
      pickDate(date) {
        const pickDay = this.bookDay.find((item) => item.id === date.id);
        this.bookDay.forEach((item) => {
          item.selected = false;
        });
        pickDay.selected = true;
        this.selectedDay = pickDay.date;
        console.log(this.selectedDay);
      },
      pickSession(session) {
        const pickSession = this.bookSession.find((item) => item.id === session.id);
        this.bookSession.forEach((item) => {
          item.selected = false;
        });
        pickSession.selected = true;
        this.selectedSession = pickSession.session;
        console.log(this.selectedSession);
      },
    },
  };
</script>

<style lang="scss">
  .picktime {
    width: 22vw;
    height: 10vw;
    color: #2c2820;
    border: 1px solid #ffd900;
    font-size: 12px;
    text-align: center;
    line-height: 10vw;
    border-radius: 5px;
  }
  .actived {
    background-color: #fff3bf;
  }
  .picksession {
    margin: 0 2px;
    width: 20vw;
    height: 6vw;
    color: #2c2820;
    border: 1px solid #ffd900;
    font-size: 12px;
    text-align: center;
    line-height: 6vw;
    border-radius: 5px;
  }
  .not-book {
    background-color: #eee;
    border: 1px solid #bbb;
  }
</style>
