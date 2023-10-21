<template>
  <view style="padding-bottom: 20vh; position: relative;"> 
    <van-nav-bar 
      title="攻略" 
      z-index="99" 
      fixed 
      placeholder 
      safe-area-inset-top
      custom-style="background-color: var(--navbar-color)">
    <van-icon name="bell" size="20px" color="white" slot="left" dot/>
    </van-nav-bar>

    <view class="record">
      <view style="display: flex; flex-direction: column;">
        <view style="font-size: 20px; font-weight: 600; margin-bottom: 2vw;">旅行攻略</view>
        <view style="color: #aaa; font-size: 14px;">分享专属于你的旅行记忆</view>
      </view>
      <van-button round color="linear-gradient(to right, #00ffff, #687bf6)" custom-style="color: black; width: 30vw" @click.native="toPublishPage">去发布</van-button>
    </view>

     <van-tabs :ellipsis="false"  swipeable  sticky :offset-top="safeAreaHeight">
       <van-tab :title="tab.name" v-for="tab in strategyType" :key="tab.id"> 
         <van-empty v-if="tab.list.length === 0" image="search" description="内容为空" />
         <view id="left">
           <Cover 
             v-for="(item, i) in tab.list" 
             :key="i" 
             v-if="i%2===0"
             :articleData="item"
             :author="getAuthor(item)"
             @click.native="toArticle(item)">
           </Cover>
         </view>
         <view id="right">
           <Cover 
            v-for="(item, i) in tab.list" 
            :key="i" 
            v-if="i%2===1"
            :articleData="item" 
            :author="getAuthor(item)"
            @click.native="toArticle(item)">
          </Cover>
         </view>
       </van-tab>
     </van-tabs>
  </view>
</template>
 
<script> 
  import { mapActions } from 'vuex'
  import Cover from "../../components/cover/cover.vue"
  const app = getApp()
  export default {
    components: { Cover },
    data() {
      return {
        strategyList: [],
        strategyType: [],
        tabList: [],
        userInfo:{},
        authorList: []
      };
    },
    onLoad() {
      console.log(app.globalData)
      this.initData()
    },
    onPullDownRefresh() {
      this.initData('refresh')
    },
    computed: {
      safeAreaHeight() {
        return app.globalData.safeAreaHeight
      }
    },
    methods: {
      ...mapActions({
        getStrategy: 'strategy/getStrategy',
        getStartegyCategory:'strategy/getStartegyCategory',
        getArticleAuthor: 'user/getArticleAuthor',
      }),
      getAuthor(article) {
        // console.log("文章",this.authorList)
        return this.authorList?.find(item => item.username === article.userName)
      },
      handleAuthorGet() {
         this.getArticleAuthor().then(res => {
           // console.log(res)
           this.authorList = res.data
         })
       },
      async initData(operation) {
        await this.handleAuthorGet()
        this.strategyList = await this.getStrategy()
        const res = await this.getStartegyCategory()
        this.strategyType = res.filter(item => item.isShow)
        this.strategyType = this.strategyType.map(item => {
          item.list = this.strategyList.filter(s => s.type === item.name)
          return item
        })
        // console.log(this.strategyType)
        
        operation === 'refresh' && wx.stopPullDownRefresh();
      },
      toArticle(item) { 
        wx.navigateTo({
          url:`/pages/subPackage/article/article?data=${JSON.stringify(item)}`,
        })
      },
      toPublishPage() {
        wx.navigateTo({
          url: '/pages/subPackage/strategyEdit/strategyEdit'
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
#left, #right{
 width: 48%;
 margin: 0 1%;
 float: left;
}
#left image, #right image{
 width: 100%;
}  
  
.record {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 30vw;
  background-color: white;
  border: #d7dbdd 1px solid;
  margin: 2vw; 
  border-radius: 6px;
  box-shadow: #ddd 6px 6px 4px;
}
/deep/ .skeleton {
  width: 50vw;
  height: 50vw;
  background-color: white;
}
</style>
