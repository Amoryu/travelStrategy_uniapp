<template>
  <view style="margin: 2vw; padding-bottom: 20vw">
    <van-dialog id="van-dialog" />
    <van-toast id="van-toast" />
    <van-notify id="van-notify" safeAreaInsetTop />
    <van-nav-bar left-arrow fixed placeholder @click-left="back">
      <view slot="title" style="display: flex; align-items: center; height: 60px;">
        <van-image round lazy-load width="30px" height="30px" :src="articleAuthor.avatar || ''"/>
        <view style="margin-left: 1vw; height: 60px;">{{ articleAuthor.name }}</view>
      </view>
    </van-nav-bar>
    
    <van-image v-if="fileList[0].url" width="100%" fit="widthFix" radius="10px" :src="fileList[0].url" use-loading-slot>
      <van-loading slot="loading" type="spinner" size="20" vertical />
    </van-image>
    
    <view style="display: flex; align-items: center;justify-content: space-between;">
      <view v-if="detail.address">
        <van-icon name="location" color="green" />{{detail.address}}
      </view>
      <view style="font-size: 14px; color: #666; margin: 2vw">{{detail.publishtime}}发布</view>
    </view>
    
    
    <van-field
      readonly
      maxlength="50"
      :value="detail.title"
      @change="detail.title = $event.detail"
      custom-style="font-weight:bold; font-size: 20px"
      placeholder="一个好的标题会吸引更多人~"
      :autosize="{ minHeight: 24 }"
      type="textarea"
      placeholder-style="font-weight: bold; font-size: 20px" />
    <van-field
      readonly
      maxlength="1000"
      :value="detail.content"
      @change="detail.content = $event.detail"
      :border="false"
      :autosize="{ minHeight: 150 }"
      custom-style="font-size: 16px"
      type="textarea"
      placeholder="分享你的心情和故事吧~" />

    <!-- 三个宫格 -->
    <van-cell>
      <van-grid :border="false" column-num="3" custom-class="additional">
          <van-grid-item v-for="(item,index) in ['type','duration','perCost']" :key="index">
            <view slot="icon" class="fs-12">
              {{item === 'type' ? '游玩类型' :  item === 'duration' ? '游玩时长' : '人均成本' }}
            </view>
            <view slot="text" class="more-info">{{detail[item] || '--'}}</view>
          </van-grid-item>
        </van-grid>
    </van-cell>

    <view style="margin-top: 4vw; font-weight: bold">相关推荐</view>

    <van-goods-action custom-class="operation">
      <view @click="collect" v-if="!isMyArticle">
        <van-goods-action-icon v-if="like" icon="like" color="red" text="点赞" dot />
        <van-goods-action-icon v-else icon="like-o" text="点赞" dot />
      </view>
      <van-goods-action-icon icon="chat-o" text="评论" @click="foldComment(false)" dot />
      <van-goods-action-icon icon="share-o" text="转发" @click="shareArticle" />
      <van-share-sheet :show="showShare" title="立即分享给好友" :options="shareOptions" @select="selectShare" @close="closeShare" />
      <van-goods-action-icon v-if="isMyArticle" icon="edit" text="编辑" @click="editArticle" />
      <van-goods-action-button text="文章提及" type="warning" />
    </van-goods-action>

    <!-- 评论区 -->
    <van-popup :show="showComment" round closeable safe-area-inset-top position="bottom" custom-style="" @close="foldComment(true)">
      <van-divider contentPosition="center" customStyle="font-size: 14px; margin: 8vw 2vw 0">共96条评论</van-divider>
      <view style="overflow: hidden">
        <view style="height: 60vh; overflow: auto; padding: 2vw">
          <Comment v-for="(item,index) in 8" :key="index"></Comment>
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script>
  import { mapActions } from 'vuex';
  import { shareOptions } from '../../../common/js/common.js';
  import Comment from '../../../components/comment/comment.vue';
  export default {
    components: { Comment },
    data() {
      return {
        fileList: [{ url: '' }],
        detail: {},
        like: false,
        showComment: false,
        showShare: false,
        shareOptions,
        USERINFO: {},
        isMyArticle: false,
        articleAuthor: {},
      };
    },
    async onLoad(options) {
      this.USERINFO = JSON.parse(wx.getStorageSync('userInfo'));
      const data = JSON.parse(options.data);
      this.detail = await this.getStrategy({ id: data.id})

      this.articleAuthor  = (await this.getUser({ userName: this.detail.userName}))?.data
      this.like = (await this.getCollectState({ strategy_id: data.id, username: this.USERINFO.username }))?.data
      
      this.isMyArticle = this.USERINFO.username ===  this.articleAuthor.username;
  
      wx.downloadFile({
        url: data.coverImg,
        success: (res) => {
          console.log(res)
          this.fileList[0].url = res.tempFilePath;
        },
        fail: res => {
          console.log(res)
        }
      });
    },
    methods: {
      ...mapActions({
        editArticle: 'strategy/editArticle',
        collectStrategy: 'strategy/collectStrategy',
        getCollectState: 'strategy/getCollectState',
        publish: 'strategy/publish',
        getStrategy: 'strategy/getStrategy',
        getUser: 'user/getUser'
      }),
      back() {
        wx.switchTab({
          url: '/pages/user/user'
        });
      },
      collect() {
        this.like = !this.like;
        this.collectStrategy({
          strategy_id: this.detail.id,
          username: this.USERINFO.username,
          isCollect: this.like,
        }).then((res) => {
          this.$utils.Toast({
            type: 'success',
            message: this.like ? '收藏成功' : '已取消收藏',
          });
        });
      },
      editArticle() {
        wx.navigateTo({
          url: `/pages/subPackage/strategyEdit/strategyEdit?data=${JSON.stringify(this.detail)}`
        })
      },
      shareArticle() {
        this.showShare = true;
      },
      selectShare(e) {
        console.log(e);
      },
      closeShare() {
        this.showShare = false;
      },
      foldComment(state) {
        this.showComment = !state;
      },
    },
  };
</script>

<style lang="scss">
  .title {
    font-weight: bold;
    font-size: 20px;
  }
  .content {
    color: #666;
  }
  .operation {
    z-index: 9;
  }
  .title1 {
    font-weight: 600;
    font-size: 16px;
  }
  .grid1,
  .grid2 {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-flow: row wrap;
  }
  .grid1 {
    height: 100px;
  }
  .grid2 {
    height: 60px;
  }

  .btn {
    width: 80px;
    padding: 2px;
    border: 1px solid var(--navbar-color);
    border-radius: 5px;
  }
  .actived {
    background-color: var(--navbar-color);
  }
  .more-info {
    font-size: 16px; 
    font-weight: 600;
  }
  .fs-12 {
    font-size: 12px;
  }
</style>
