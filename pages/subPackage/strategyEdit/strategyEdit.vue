<template>
  <view style="height: 100%; padding-bottom: 20vh">
    <!-- 在页面内添加对应的节点 -->
    <van-dialog id="van-dialog" />
    <van-notify id="van-notify" />
    <van-nav-bar z-index="99" fixed placeholder custom-style="background-color: var(--navbar-color);">
      <van-icon slot="left" name="cross" @click="back"></van-icon>
      <view slot="title">
        <!-- 新建文章 -->
        <van-button v-if="!isNotNew" icon="share" round size="small" type="info" @click="handleArticle('publish')" plain>发布</van-button>
        <!-- 编辑文章 -->
        <van-button v-if="isNotNew" icon="passed" round size="small" type="info" @click="handleArticle('edit')" plain>保存</van-button>
        <van-button v-if="isNotNew" icon="delete-o" round size="small" type="danger" @click="deleteArticle" plain custom-style="margin-left:5px">删除</van-button>
      </view>
    </van-nav-bar>

    <view style="background-color: #f7f8fa" class="tac">
      <van-uploader
        upload-text="添加封面"
        :file-list="fileList"
        max-count="1"
        deletable="true"
        preview-image
        @delete="deletePic"
        @after-read="afterRead"
        preview-size="30vh" />
    </view>
    <!-- 添加位置信息按钮 -->
    <van-cell>
      <view slot="title" @click="showAreaSelector = true">
        <van-icon name="location" color="green"/>
        {{selectedLocation ? selectedLocation: '添加位置信息'}}
      </view>
      <view slot="right-icon" style="color: blue" @click="useGPSLocation">
        <van-icon name="aim" />使用当前位置
      </view>
    </van-cell>
    <van-popup safe-area-inset-top :show="showAreaSelector" position="bottom" custom-style="height: 50vh;" @close="showAreaSelector = false">
      <van-area title="选择所在地" :area-list="areaList" :value="articleInfo.area || '110101'" :columns-num="3" @confirm="changeArea" @cancel="showAreaSelector = false" />
    </van-popup>

    <view style="background-color: white">
      <van-field
        :value="articleInfo.title"
        @change="articleInfo.title = $event.detail"
        show-word-limit
        maxlength="50"
        :autosize="{ minHeight: 24 }"
        type="textarea"
        custom-style="font-weight:bold; font-size: 20px;"
        placeholder="一个好的标题会吸引更多人~"
        placeholder-style="font-weight: bold"></van-field>
      <van-field
        :value="articleInfo.content"
        @change="articleInfo.content = $event.detail"
        :border="false"
        :autosize="{ minHeight: 150 }"
        type="textarea"
        custom-style="font-size: 16px;"
        show-word-limit
        maxlength="1000"
        placeholder="分享你的心情和故事吧~"></van-field>
    </view>

    <van-cell>
      <van-grid :border="false" column-num="3" @click.native="isShowMoreInfo = true">
        <van-grid-item v-for="(item,index) in ['type','duration','perCost']" :key="index">
          <view slot="icon" class="fs-12">
            {{item === 'type' ? '游玩类型' :  item === 'duration' ? '游玩时长' : '人均成本' }}
          </view>
          <view slot="text" class="more-info">{{additionalInfo[item] || '--'}}</view>
        </van-grid-item>
      </van-grid>
    </van-cell>

    <van-popup round :show="isShowMoreInfo" custom-style="height: fit-content; width: 90%" @close="additionalDoneEdit">
      <van-cell title="游玩类型" use-label-slot title-class="title">
        <view slot="label" class="grid1">
          <view v-for="cate in type" :key="cate.id"
            class="btn tac"
            :class="cate.selected ? 'actived' : ''"
            @click="selectThisCate('type', cate.id)">
            {{cate.name}}
          </view>
        </view>
      </van-cell>
      <van-cell title="游玩时长" use-label-slot title-class="title">
        <view slot="label" class="grid2">
          <view v-for="item in duration" :key="item.id"
            class="btn tac" :class="item.selected ? 'actived' : ''"
            @click="selectThisCate('duration', item.id)">
            {{item.name}}
          </view>
        </view>
        <van-field v-if="!duration.find(d =>d.name === this.additionalInfo.duration) || additionalInfo.duration === '自定义'"
            type="number" slot="label"
            :value="additionalInfo.duration === '自定义' ? '' : additionalInfo.duration"
            placeholder="请输入时长(天)"
            custom-style="background-color: #f0f5f8; border-radius: 10px"
            @blur="setDuration"></van-field>
        </van-cell>
      </van-cell>
      <van-cell title="人均成本(元)" use-label-slot title-class="title">
        <van-field type="number" slot="label"
          :value="additionalInfo.perCost"
          placeholder="请输入金额"
          custom-style="background-color: #f0f5f8; border-radius: 10px;margin-bottom: 4px"
          @blur="setCost"></van-field>
      </van-cell>
    </van-popup>
  </view>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { areaList, travelType, travelDuration, getLocationInfo } from '../../../common/js/common.js';
  export default {
    data() {
      return {
        isShowMoreInfo: false,
        selectedLocation: '',
        showAreaSelector: false,
        articleInfo: {  },
        curArea: '',
        fileList: [],
        areaList,
        GPSPosition: {},
        type: [],
        additionalInfo: {
          type: '城市探索',
          duration: '半天内',
          perCost: 0,
        },
        duration: travelDuration,
        USERINFO: {},
        isNotNew: false,
        article: null
      } 
    },
    computed: {
      ...mapState(['currentAddress']),
     
    },
    async onLoad(options) {
      if(options.data) {
        this.article = JSON.parse(options.data);
        console.log(this.article);
        this.isNotNew = true;
        this.articleInfo = this.article
        Object.keys(this.additionalInfo).forEach(i=>{this.additionalInfo[i] = this.article[i] || this.additionalInfo[i]})
        this.selectedLocation = this.article.address;
        this.fileList.push({
          url: this.article.coverImg
        });
        wx.downloadFile({
          url: this.article.coverImg,
          success: (res) => {
            this.fileList[0].url = res.tempFilePath;
          },
        })
       
      }

      this.USERINFO = JSON.parse(wx.getStorageSync('userInfo'));
      const location = await getLocationInfo();
      this.GPSPosition = {
        city: location.city, 
        area: location.area,
        street: location.street, 
      }; 
 
      this.getStartegyCategory().then(res => {
        this.type = res.filter(item => item.isShow).map(item => {
          item.selected = item.name === this.additionalInfo.type
          return item
        })
      });
      
      this.duration.forEach(item => {
        item.selected = item.name === this.additionalInfo.duration
      })
    },
    methods: {
      ...mapActions({
        getCurrentArea: 'common/getCurrentArea',
        changeCurrentArea: 'common/changeCurrentArea',
        getStartegyCategory: 'strategy/getStartegyCategory',
        publish: 'strategy/publish',
        edit: 'strategy/edit',
        deleteStrategy: 'strategy/deleteStrategy',
      }),
      additionalDoneEdit(){
        this.isShowMoreInfo = false
      },
      deleteArticle() {
        this.$utils.Dialog.confirm({ title: '提示', message: '确认要删除这篇攻略吗' })
        .then(() => { // on confirm
            wx.showLoading({ title: '正在删除' });
            this.deleteStrategy({ id: this.article.id })
            .then(res => {
              wx.hideLoading();
              this.$utils.showToast('删除成功','success',2000, null, null,() => {
                wx.switchTab({ url: '/pages/user/user' });
              })
            })              
          }).catch(() => {});
      },
      handleArticle(operation) {
        if (!this.fileList[0]) {
          return this.$utils.showToast('请设置封面图','error',1000)
        }
        wx.showLoading({ title: '保存中', mask: true });
        wx.uploadFile({
          url: `${this.config.baseUrl}/api/image`,
          name: 'file',
          filePath: this.fileList[0].url,
          success: (res) => {
            const { coverImg } = JSON.parse(res.data);
            let articleData = {
              ...this.articleInfo,
              ...this.additionalInfo,
              address: this.selectedLocation,
              username: this.USERINFO.username,
              coverImg,
            }
            
            let result = null
            if(operation === 'edit') {
              articleData.id = this.article.id
            }
            result = this[operation](articleData)
            // 返回结果
            result.then(res => {
              wx.hideLoading();
              if (res.code === 200) {
                const successText = operation === 'publish' ? '发布成功' : '修改成功'
                this.$utils.showToast(successText,'success',2000,null,null,() => {
                  wx.reLaunch({
                    url: `/pages/subPackage/article/article?data=${ operation === 'publish' ? JSON.stringify(res.data) : JSON.stringify(res.data)}` 
                  })
                })
              } else {
                const failText = operation === 'publish' ? '发布失败' : '修改失败'
                this.$utils.showToast(failText,'error',2000)
              }
            });
          },
          fail: (err) => { console.log(err)  }
        });
      },
      selectThisCate(type, id) {
        this[type].forEach((item) => {
          item.selected = false
          if(item.id === id) {
            item.selected = true
            this.additionalInfo[type] = item.name;
          }
        });
        
      },
      setDuration(e) {
        if(+e.detail.value < 0) return
        this.additionalInfo.duration = `${+e.detail.value < 2000 ? +e.detail.value : 2000}天`;
      },
      setCost(e) {
        if(+e.detail.value < 0) return
        this.additionalInfo.perCost = `${+e.detail.value < 100000 ? +e.detail.value : 100000}元`;
      },
      changeArea({ detail }) {
        const [province,city,area] = detail.values.map(item => item.code)
        const [provinceName,cityName,areaName] = detail.values.map(item => item.name)
      
       this.selectedLocation = areaName
       this.articleInfo.provinceName = provinceName
       this.articleInfo.province = province
       this.articleInfo.cityName = cityName
       this.articleInfo.city = city
       this.articleInfo.areaName = areaName
       this.articleInfo.area = area
       // console.log("地址信息",detail.values)
       this.showAreaSelector = false
      },
      back() {
        if (!!this.isNotNew) {
          return wx.navigateBack({  delta: 1 });
        }
        this.$utils.Dialog.confirm({ title: '提示', message: '当前文章正在编辑，确认要离开吗(不会保存当前编辑的内容)'})
        .then(() => {  // on confirm
            wx.switchTab({  url: '/pages/strategy/strategy' });
          }).catch(() => { });
      },
      deletePic(e) {
        this.fileList.splice(e.detail.index, 1);
      },
      afterRead(event) {
        const { file } = event.detail;
        this.fileList.push({
          url: file.url,
        });
      },
      useGPSLocation() {
        this.selectedLocation = this.GPSPosition.area;
        wx.showToast({ title: '切换成功' });
      },
    },
  };
</script>

<style lang="scss">
  .title {
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
    width: 22vw;
    padding: 2px;
    border: 1px solid var(--navbar-color);
    border-radius: 5px;
  }
  .actived {
    background-color: var(--navbar-color);
  }
  .additional {
    height: 8vw;
  }
  .more-info {
    font-size: 16px; 
    font-weight: 600;
  }
  .fs-12 {
    font-size: 12px;
  }
</style>
