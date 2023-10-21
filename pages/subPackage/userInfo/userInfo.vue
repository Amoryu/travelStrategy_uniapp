<template>
  <view>
    <van-nav-bar title="资料" left-arrow z-index="99" fixed placeholder @click-left="back" custom-style="background-color: var(--navbar-color)"></van-nav-bar>
    <view>
      <view class="tac" style="position: relative">
        <van-image :src="bgImg" width="100vw" height="30vh"></van-image>
        <image
          v-if="!isEdit"
          :src="userInfo.avatar || defaultAvatarUrl"
          class="avatar"></image>
        <view v-else class="upload-avatar">
          <van-uploader
            upload-text="更换头像"
            :file-list="fileList"
            max-count="1"
            deletable="true"
            preview-image
            @delete="e => fileList.splice(e.detail.index, 1)"
            @after-read="afterRead"
            preview-size="100px" />
        </view>
      </view>
      <!-- 非编辑状态 -->
      <van-cell-group  v-if="!isEdit">
        <van-cell title="用户昵称" :value="userInfo.name" />
        <van-cell title="薛定猫用户名" label="可登录后台管理系统进行修改" :value="userInfo.username" />
        <van-cell title="性别" :value="userInfo.gender ? '男' : '女'" />
        <van-cell title="手机号码" :value="userInfo.phone" />
        <van-cell title="所在地" :value="userInfo.address" />
        <van-cell title="个性签名" :value="userInfo.signature" />
      </van-cell-group>
      <!-- 编辑状态 -->
      <van-cell-group  v-else >
        <van-field :value="userInfo.name" label="用户昵称" placeholder="请输入用户昵称" input-align="right" @blur="e => userInfo.name = e.detail.value" />
        <van-cell title="薛定猫用户名" label="可登录后台管理系统进行修改" :value="userInfo.username" />
        <van-cell title="性别">
          <van-radio-group
            :disabled="!isEdit"
            slot="right-icon"
            :value="String(userInfo.gender)"
            direction="horizontal"
            @change="e => userInfo.gender = +e.detail">
            <van-radio name="1">男</van-radio>
            <van-radio name="0">女</van-radio>
          </van-radio-group>
        </van-cell>
        <van-field
          :value="userInfo.phone"
          label="手机号码"
          type="number"
          placeholder="请输入手机号码"
          input-align="right"
          @blur="e => userInfo.phone = e.detail.value" />
        <van-field :value="userInfo.address" label="所在地" placeholder="请输入所在地址" input-align="right" @blur="e => userInfo.address = e.detail.value" />
        <van-field
          :value="userInfo.signature"
          label="个性签名"
          placeholder="请输入个性签名"
          input-align="right"
          @blur="e => userInfo.signature = e.detail.value" />
      </van-cell-group>

      <van-cell-group inset title=" ">
        <van-button v-if="isEdit" type="primary" block @click="save">保存</van-button>
        <van-button v-else icon="edit" block type="info" @click="isEdit = true">编辑资料</van-button>
      </van-cell-group>
    </view>
  </view>
</template>

<script>
  import { mapActions } from 'vuex';
  import { defaultAvatarUrl } from '../../../common/js/common.js'
  export default {
    onLoad(options) { 
      this.userInfo = JSON.parse(options.data);
      console.log(this.userInfo)
      wx.downloadFile({
        url: this.userInfo.avatar,
        success: res => {
          this.fileList[0].url = res.tempFilePath
        }
      })
    },
    data() {
      return {
        defaultAvatarUrl: defaultAvatarUrl,
        isEdit: false,
        userInfo: {},
        fileList: [{ url: '' }],
        bgImg: `http://192.168.1.100:8098/uploads/swiper/bg.jpg`,
      };
    },
    methods: {
      ...mapActions({
        updateUserInfo: 'user/updateUserInfo',
      }),
      afterRead(event) {
        const { file } = event.detail;
        this.fileList.push({
          url: file.url,
        });
      },
      back() {
        wx.switchTab({
          url: '/pages/user/user',
        });
      },
      save() {
        this.$utils.showToast('正在提交','loading',3000)
        wx.uploadFile({
          url: `${this.config.baseUrl}/api/image`,
          name: 'file',
          filePath: this.fileList[0].url,
          success: (res) => {
            const { coverImg } = JSON.parse(res.data);
            // console.log(coverImg);
            this.userInfo.avatar = coverImg;
            this.updateUserInfo(this.userInfo).then((res) => {
              if(res.code === 200) {
                this.$utils.showToast('修改成功','success',1500,null,null,() => {
                  wx.setStorage({ key: 'userInfo', data: res.data });
                })
              } else {
                this.$utils.showToast('修改失败','error',1500)
              }
              wx.hideToast();
              this.isEdit = false;
            });
          },
          fail: (err) => {  console.log(err);  },
        });
      },
    },
  };
</script>

<style lang="scss">
.upload-avatar {
  position: absolute; 
  top: 50%;
 left: 50%; 
 transform: translate(-50%, -50%); 
 border-radius: 20px;
}
.avatar {
  width: 24vw;
  height: 24vw;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 20px;
  transform: translate(-50%, -50%);
  background:#ccc url(../../../static/assets/0.png) no-repeat 0 0 / 100%;
}
</style>
