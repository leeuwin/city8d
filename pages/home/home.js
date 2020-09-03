import { Home } from './home-model.js';
import { HOT_CITY } from '../../utils/constants.js';
import { PASSENGER_AREA } from '../../utils/constants.js';
import { DRIVER_AREA } from '../../utils/constants.js';
import { CONSIGNOR_AREA } from '../../utils/constants.js';

var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const home = new Home();

Page({
  data: {
    hotcitys: HOT_CITY,
    passenger_area: PASSENGER_AREA,
    driver_area: DRIVER_AREA,
    consignor_area: CONSIGNOR_AREA,
    srcRegion: ['不限', '不限', '不限'],
    dstRegion: ['不限', '不限', '不限'],
  },

  onLoad: function(options) {
    qqmapsdk = new QQMapWX({
      key: 'D7RBZ-L37W6-A5ASJ-EDEXZ-3JFLJ-73FAE'
    });
  },

  toTrips: function (e) {
    
    const city = e.currentTarget.dataset.city;
    this.data.dstRegion[0] = city.province;
    this.data.dstRegion[1] = city.city;
    this.data.dstRegion[2] = city.dist;

    wx.setStorageSync('city', city);
    wx.setStorageSync('srcRegion', this.data.srcRegion);
    wx.setStorageSync('dstRegion', this.data.dstRegion);

    //获取当前位置城市信息
    if (this.data.srcRegion[0] == '不限') {
      this.bindGetLocation();
    }
    else
    {//直接跳转
      wx.switchTab({
        url: '/pages/trips/trips'
      });
    }
  },
  bindGetLocation: function (e) {
    let _this = this;
    wx.getSetting({
      success(res) {
        // 判断定位的授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              _this.getLocation(e);
            },
            fail(errMsg) {
              wx.showModal({
                title: '哎呀！地址定位失败！', //提示的标题,
                content: '请开启手机和微信定位！', //提示的内容,
                showCancel: true, //是否显示取消按钮,
                cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
                cancelColor: '#000000', //取消按钮的文字颜色,
                confirmText: '开启定位', //确定按钮的文字，默认为取消，最多 4 个字符,
                confirmColor: '#3CC51F', //确定按钮的文字颜色,
                success: res => {
                  if (res.confirm) {
                    wx.openSetting({
                      success: res => {
                        console.log(res.authSetting);
                      }
                    });
                  } else if (res.cancel) {
                    console.log('用户拒绝使用地理位置');
                  }
                }
              });
            }
          })
        } else {
          _this.getLocation(e);
        }
      }
    })
  },
  // 获取地址
  getLocation(e) {
    const _this = this;
    wx.getLocation({
      success: function (res) {
        console.log(res);
        _this.getLocal(res.longitude, res.latitude);
      },
      fail: function (error) {
        console.log(error);
        console.log("获取失败");
      }
    });
  },
  // 获取当前地理位置
  getLocal: function (longitude, latitude, key) {
    let _this = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        _this.setData({
          'srcRegion[0]': province,
          'srcRegion[1]': city,
        });
        wx.setStorageSync('srcRegion', _this.data.srcRegion);
        wx.switchTab({
          url: '/pages/trips/trips'
        });
      },
      fail: function (res) {
        console.log(res);
        _this.setData({
          'fromAddrName': '获取地址失败'
        })
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  // 转发
  onShareAppMessage(options) {
    return {
      title: '城八方·顺风车',
      path: '/pages/home/home'
    }
  },
})
