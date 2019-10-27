import { SEATS,PRICE, LOCATION, ROLE_TYPES, TRIP_TYPES, DRIVER_AUDIT_STATUS } from '../../utils/constants';
import { isError, addTime, formatTime } from '../../utils/util';
import { User } from '../../utils/user';
import { Auth } from '../../utils/auth';
import { Publish } from './publish-model';
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

const app = getApp(); //获取应用实例
const auth = new Auth(); // 获取权限实例

Page({
  data: {
    trip: {
      publisher: 1,
      type: 1, // 1 车辆行程 2 乘客行程 3 寄件行程
      fromAddrName: '哪里出发', // 出发地名称
      fromAddress: '', // 出发地地址
      fromLongitude: '', // 出发地经度
      fromLatitude: '', // 出发地纬度
      throughAddrName: '途经(选填)', // 出发地名称
      throughAddress: '', // 出发地地址
      throughLongitude: '', // 出发地经度
      throughLatitude: '', // 出发地纬度
      destAddrName: '要去哪里', // 名称
      destAddress: '', // 地址
      destLongitude: '', // 经度
      destLatitude: '', // 纬度
      price: 0,
      startTime: '12:00',
      endTime: '12:30',
      seatCount: 3, // 座位/人数
      cargoCount: 1,
      remarks: '', // 备注
      date: formatTime().date, // 日期
      weekday: formatTime().weekday,//星期
      //earliestTime: formatTime().time1,
      earliestTime: '最早出发时间',
      latestTime: '最迟出发时间'
    },
    params: { type: 1},
    userInfo: null,
    SEATS,
    PRICE,
    tripTypes: Object.values(TRIP_TYPES), // 对象属性值的数组
    today: formatTime().date,
    maxday: formatTime(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).date,
    currentTime: formatTime().time1,
    isAgree: false,
    showTopTips: false,
    errorMsg: ''
  },
  // Tab 切换
  tabClick: function (e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      ['params.type']: type
    });
    if (type === 1 && this.data.passengerTrips.length === 0) {
      this.fetchMyTrips();
    }
    if (type === 2 && this.data.driverTrips.length === 0) {
      this.fetchMyTrips();
    }
  },
  onLoad() {
    //wx.getUserInfo();
    //this.bindGetUserInfo();
    qqmapsdk = new QQMapWX({
      key: 'D7RBZ-L37W6-A5ASJ-EDEXZ-3JFLJ-73FAE'
    });
  },

  onShow() {
    this.__getUserInfo().then(() => {
    });
    this.checkAuth();
    var city = wx.getStorageSync('city');
    //this.setData({ ['trip.destName']: city.name })
  },

  // 获取用户信息
  __getUserInfo() {
    const promise = new Promise((resolve, reject) => {
      const userInfo = app.globalData.userInfo;
      if (userInfo) { // 当用户通过正常的跳转进入该页面(用户信息已经获取并存储在globalData中)
        this.setData({ userInfo })
        resolve();
      } else { 
        // 当用户直接进入该页面(通过二维码或者分享链接)
        /*原本的实现，不知道什么意思
        app.userInfoCallback = userInfo => { // 这是个异步过程
          this.setData({ userInfo })
          resolve();
        }*/
        //lim修改的版本，获取用户信息
        reject();
      }
    })
    return promise;
  },

  // 校验权限
  checkAuth() {
    const result = auth.checkAuth('publish', 'publish', this.data.trip.type);
  },
  bindKeyInput: function (e) {
    this.setData({
      ['trip.price']: e.detail.value
    })
  },
  // 行程类型
  bindTripTypeChange(e) {
    let tripTypes = this.data.tripTypes;
    const value = e.detail.value; // string
    for (var i = 0, len = tripTypes.length; i < len; ++i) {
      tripTypes[i].checked = tripTypes[i].value == e.detail.value;
    }
    this.setData({
      ['trip.type']: value,
      tripTypes: tripTypes
    });
  },

  // 重置行程type
  __resetTripType() {
    let tripTypes = this.data.tripTypes;
    for (var i = 0, len = tripTypes.length; i < len; ++i) {
      tripTypes[i].checked = false;
    }
    tripTypes[0].checked = true;
    this.setData({
      ['trip.type']: 1,
      tripTypes: tripTypes
    });
  },
  bindChooseLocation: function (e) {
    let _this = this;
    wx.getSetting({
      success(res) {
        // 判断定位的授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              _this.chooseLocation(e);
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
          _this.chooseLocation(e);
        }
      }
    })
  },
  // 获取地址
  chooseLocation(e) {
    const _this = this;
    wx.chooseLocation({
      latitude:38,
      longitude:106,
      success: function (res) {
        const key = `trip.${e.currentTarget.id}`,
          name = `${key}AddrName`,
          address = `${key}Address`,
          longitude = `${key}Longitude`,
          latitude = `${key}Latitude`;
        _this.setData({
          [name]: res.name,
          [address]: res.address,
          [longitude]: res.longitude,
          [latitude]: res.latitude
        });
      },
      fail: function (error) {
        console.log(error);
        console.log("获取失败");
      }
    });
  },
  bindGetLocation: function (e) {
    let _this = this;
    _this.setData({
      'trip.fromAddrName': '定位中....'
    });
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
                    _this.setData({
                      'fromAddrName': '定位失败'
                    })
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
      type: 'gcj02',
      success: function (res) {
        const key = `trip.${e.currentTarget.id}`;
        console.log(res);
        _this.getLocal(res.longitude, res.latitude, key);
      },
      fail: function (error) {
        console.log(error);
        console.log("获取失败");
        _this.setData({
          'fromAddrName': '定位失败'
        })
      }
    });
  },
  // 获取当前地理位置
  getLocal: function (longitude, latitude, key) {
    let _this = this;
    const name = `${key}AddrName`,
      address = `${key}Address`,
      lng = `${key}Longitude`,
      lat = `${key}Latitude`;
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
          [name]: res.result.formatted_addresses.recommend,
          [address]: res.result.address,
          [lng]: res.result.location.lng,
          [lat]: res.result.location.lat
        })
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
  // 选择座位
  bindSeatChange(e) {
    const value = Number(e.detail.value) + 1;
    this.setData({
      ['trip.seatCount']: value
    })
  },

  
  // 公共方法
  bindPickerChange(e) {
    const id = e.target.id;
    let value = e.detail.value;
    const key = `trip.${e.target.id}`;
    this.setData({
      [key]: value // ID 对应 key值
    })
  }, 
  bindDateChange: function (e) {
    let day = formatTime(e.detail.value).weekday;
    this.setData({
      'trip.date': e.detail.value,
      'trip.weekday': day
    })
  },
  // 行李选择方法
  bindPickerCargoChange(e) {
    const id = e.target.id;
    let value = e.detail.value;
    const key = `trip.${e.target.id}`;
    this.setData({
      [key]: SEATS[value] // ID 对应 key值
    })
  },
  // 选择出行时间区间
  bindPickerTimeChange(e) {
    const id = e.target.id;
    let value = e.detail.value;
    this.setData({
      ['trip.earliestTime']: value, // ID 对应 key值
      ['trip.latestTime']: addTime(value,30).time
    })
  },
  // 同意协议
  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    })
  },

  // 提交表单
  bindFormSubmit: function(e) {
    if (this.valid()) {
      this.publish();
    }
  }, 
  bindFormReset: function () {
    this.setData({
      ['trip.fromAddrName']: '哪里出发',
      ['trip.throughAddrName']: '途经(选填)',
      ['trip.destAddrName']: '要去哪里',
      ['trip.date']: formatTime().date,
      ['trip.weekday']: formatTime().weekday,
      ['trip.earliestTime']: '最早出发时间',
      ['trip.latestTime']: '最迟出发时间',
      ['trip.seatCount']: 3,
      ['trip.cargoCount']: 1,
      ['trip.price']: 0,
      ['trip.remarks']: '',
      ['isAgree']:false
    })
  },
  // 校验字段合法性
  valid() {
    const trip = this.data.trip;

    if (trip.fromAddress === '') {
      isError('请选择出发地', this);
      return false;
    }

    if (trip.destAddress === '') {
      isError('请选择目的地', this);
      return false;
    }

    if (trip.date === '出发日期') {
      isError('请选择出发日期', this);
      return false;
    }

    if (trip.earliestTime === '最早出发时间') {
      isError('请选择最早出发时间', this);
      return false;
    }
    trip.startTime = `${trip.date } ${trip.earliestTime}:00`;
    trip.endTime = `${trip.date} ${trip.latestTime}:00`;
    return true;
  },

  // 发布
  publish: function() {
    wx.showLoading({
      title: '发布中',
      mask: true
    });

    const publish = new Publish();
    publish.createTrip(this.data.trip)
      .then(res => {
        wx.showToast({
          title: '发布成功'
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/trips/trips'
          })
        }, 1500)
      })
      .catch(error => {
        wx.hideLoading();
        console.log(error);
      })
  },
})
