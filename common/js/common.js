//定义全局变量
import { areaList } from '@vant/area-data';
import QQMapWX from '@/libs/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js';
import FormData from '@/libs/formData.js'

const defaultAvatarUrl = `https://7072-prod-2gaqay1j0c5439c7-1312822569.tcb.qcloud.la/travelStrategy/0.png?sign=e5a6eb89ae0859abc71acad37a715270&t=1696870000`;

const orderList = [
  { name: '门票', imgSrc: '/static/assets/menpiao.png', page: '/pages/subPackage/ticketList/ticketList' },
  { name: '当地游', imgSrc: '/static/assets/local2.png', page: '/pages/subPackage/ticketList/ticketList' },
  { name: '酒店', imgSrc: '/static/assets/hotel4.png', page: '/pages/subPackage/hotelBook/hotelBook' },
  { name: '跟团游', imgSrc: '/static/assets/pintuan.png', page: '/pages/subPackage/ticketList/ticketList' },
];

// 分享的面板
const shareOptions = [
  [
    { name: '微信', icon: 'wechat' },
    { name: '微博', icon: 'weibo' },
    { name: 'QQ', icon: 'qq' },
  ],
  [
    { name: '复制链接', icon: 'link' },
    { name: '分享海报', icon: 'poster' },
    { name: '二维码', icon: 'qrcode' },
  ],
];

// 游玩类型
const travelType = [
  { id: 1, name: '无', selected: false },
  { id: 2, name: '美食探店', selected: false },
  { id: 3, name: '亲子游', selected: false },
  { id: 4, name: '自驾游', selected: false },
  { id: 5, name: '周边游', selected: false },
  { id: 6, name: '户外', selected: false },
  { id: 7, name: '名胜古迹', selected: false },
  { id: 8, name: '城市探索', selected: false },
  { id: 9, name: '长途旅行', selected: false },
];

// 游玩时长
const travelDuration = [
  { id: 1, name: '半天内', selected: false },
  { id: 2, name: '1天', selected: false },
  { id: 3, name: '1周内', selected: false },
  { id: 4, name: '1个月内', selected: false },
  { id: 5, name: '1个月以上', selected: false },
  { id: 6, name: '自定义', selected: false },
];

//获取位置信息
async function getLocationInfo() {
  return new Promise((resolve) => {
    //位置信息默认数据
    let location = {
      longitude: 0,
      latitude: 0,
      province: '',
      city: '',
      area: '',
      street: '',
      address: '',
    };
    uni.getLocation({
      type: 'gcj02',
      success(res) {
        location.longitude = res.longitude;
        location.latitude = res.latitude;
        // 腾讯地图Api
        const qqmapsdk = new QQMapWX({
          key: 'QPFBZ-UTAH7-EQEX5-PP27K-G64V3-B4FU7', //这里填写自己申请的key
        });
        qqmapsdk.reverseGeocoder({
          location,
          success(response) {
            let info = response.result;
            location.province = info.address_component.province;
            location.city = info.address_component.city;
            location.area = info.address_component.district;
            location.street = info.address_component.street;
            location.address = info.address;
            resolve(location);
          },
        });
      },
      fail(err) {
        console.log(err);
        resolve(location);
      },
    });
  });
}

//导出
module.exports = {
  // 数据
  orderList,
  areaList,
  shareOptions,
  travelType,
  travelDuration,
  QQMapWX,
  FormData,
  defaultAvatarUrl,
  // 方法
  getLocationInfo,
};
