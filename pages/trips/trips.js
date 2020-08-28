import { Trips } from './trips-model';
import { TRIP_TYPES } from '../../utils/constants';
import { Auth } from '../../utils/auth';
import { readyUser } from '../../utils/readyUser';
import { PAGESIZE } from '../../utils/constants';
import { isError, formatTime } from '../../utils/util';
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

const app = getApp();

Page({
  data: {
    userInfo: null,
    showDialogUserInfo: false,
    params: {
      srcRegion:[],
      dstRegion: [], 
      departureDate:'',
      type: 1, // 1. 人找车 2. 车找人
      pageSize: PAGESIZE, // 每页数量
      currentPage: 1, // 当前页
      orderReg: 'depart_time_first ASC', //排序规则,非必填
    },
    srcRegion: ['福建省','哪里出发','不限'],
    dstRegion: ['福建省','想去哪里', '不限'],
    date:'出发日期',
    weekday:0,
    today: formatTime().date,
    passengerTrips: [], // 车主行程列表
    driverTrips: [], // 乘客行程列表
    tripTypes: Object.values(TRIP_TYPES), // 类型
    totalCount: 0, // 总条数
    totalPage: 1 // 总页数
  },

  onLoad: function(options) {
    /*this.__getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    });*/
    // 获取城市信息
    qqmapsdk = new QQMapWX({
      key: 'D7RBZ-L37W6-A5ASJ-EDEXZ-3JFLJ-73FAE'
    });
  },

  onShow() {
    this.__getCity(); 
  },

  onHide() {
    wx.removeStorageSync('city');
  },

  swapRegion()
  {
    var srcRegion = this.data.srcRegion;
    var dstRegion = this.data.dstRegion;
    if(srcRegion[1]!="哪里出发" && dstRegion[1]!="想去哪里")
    {
      this.setData({
        ['srcRegion']: dstRegion,
        ['dstRegion']: srcRegion
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
                    _this.setData({
                      'srcRegion[1]': '定位失败'
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
    _this.setData({
      'srcRegion[1]': '定位中....'
    });
    wx.getLocation({
      success: function (res) {
        const key = `trip.${e.currentTarget.id}`,
          name = `${key}AddrName`,
          address = `${key}Address`,
          longitude = `${key}Longitude`,
          latitude = `${key}Latitude`;
console.log(res);
        _this.getLocal(res.longitude, res.latitude);
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
        _this.setData({
          'srcRegion[1]': '定位失败'
        })
      }
    });
  },
  // 获取当前地理位置
  getLocal: function (longitude, latitude,id) {
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
          'dstRegion[0]': province
        })
      },
      fail: function (res) {
        console.log(res);
        _this.setData({
          'srcRegion[1]': '获取城市失败'
        })
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let day = formatTime(e.detail.value).weekday;
    this.setData({
      date: e.detail.value,
      ['params.departureDate']: e.detail.value,
      weekday:day
    })
  },
  bindPickerChange: function (e) {
    let key =`${e.target.id}Region`;
    this.setData({
      [key]: e.detail.value
    });
    if (e.target.id=='src')
    {
      this.setData({
        'dstRegion[0]': e.detail.value[0]
      });
    }
  },
  // 获取用户信息 - 异步
  __getUserInfo() {
    return readyUser();
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this._resetParams();
    this.getTripsFromServer();
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function() {
    this._loadMore();
  },

  // 获取行程
  getTripsFromServer: function() {
    /*wx.showLoading({
      title: '加载中...',
      mask: true
    });*/

    const type = this.data.params.type;
    const tripType = 'driverTrips';
    const trips = new Trips();
    this.data.params.srcRegion = this.data.srcRegion;
    this.data.params.dstRegion = this.data.dstRegion;
    const params = this.data.params;
    trips.query(params).then(res => {
      const data = res.data;
      let trips = data.list
      // 如果是第一页数据
      if (this.data.params.currentPage > 1) {
        trips = [...this.data[tripType], ...trips];
      }
      this.setData({
        [tripType]: trips,
        totalCount: data.totalCount,
        totalPage: data.totalPage
      });
      wx.hideLoading();
      wx.stopPullDownRefresh();
    })
  },

  // 加载更多数据
  _loadMore: function() {
    let currentPage = this.data.params.currentPage;
    if (currentPage < this.data.totalPage) {
      currentPage++
      this.setData({
        ['params.currentPage']: currentPage
      })
      this.getTripsFromServer();
    }
  },

  // 重置查询条件
  _resetParams: function() {
    this.setData({
      ['params.currentPage']: 1
    })
  },

  // Tab 切换
  tabClick: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      ['params.type']: type
    });
    if (type === 1 && this.data.passengerTrips.length === 0) {
      this.getTripsFromServer();
    }
    if (type === 2 && this.data.driverTrips.length === 0) {
      this.getTripsFromServer();
    }
  },

  // 跳转到发布页面
  toPublish() {
    wx.switchTab({
      url: '/pages/publish/publish'
    })
  },

  // 获取城市信息
  __getCity() {
    const dstRegion = wx.getStorageSync('dstRegion');
    const srcRegion = wx.getStorageSync('srcRegion');
    
    if (srcRegion )
    {
      if (srcRegion[1] != '不限') {
        this.setData({
          ['srcRegion']: srcRegion,
        })
      }
    }
    if (dstRegion) {
      this.setData({
        ['dstRegion']: dstRegion,
      })
    }
    const city = wx.getStorageSync('city');
    let title = '行程',
      code = '';
    if (city) {
      title = city.name;
      code = city.code;
    }
    // 设置标题
    //wx.setNavigationBarTitle({ title })
    // 按目的地查询
    this.setData({
      ['params.destRegion']: code,
    })
    this.getTripsFromServer();
  },

  // 校验权限
  checkAuth(action) {
    const auth = new Auth();
    return auth.checkAuth(action);
  },

  // 打电话
  onCall(e) {
    const phoneNumber = e.detail.phoneNumber,
      type = e.detail.type;
    //这里可以绑定云呼叫，显示隐私号码，且限制请求频率
    const pass = this.checkAuth('trips', 'call', type);
    if (pass) {
      wx.makePhoneCall({ phoneNumber })
    }
  }
})
