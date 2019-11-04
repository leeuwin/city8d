// pages/jointrip/jointrip.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trip: {
      type: 1, // 1 车辆行程 2 乘客行程 3 寄件行程
      fromAddrName: '哪里出发', // 出发地名称
      fromAddress: '', // 出发地地址
      fromLongitude: '', // 出发地经度
      fromLatitude: '', // 出发地纬度
      throughAddrName: '途经(选填)', // 出发地名称
      throughAddress: '', // 出发地地址
      throughLongitude: null, // 出发地经度
      throughLatitude: null, // 出发地纬度
      destAddrName: '要去哪里', // 名称
      destAddress: '', // 地址
      destLongitude: null, // 经度
      destLatitude: null, // 纬度
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取用户信息
  __getUserInfo() {
    const promise = new Promise((resolve, reject) => {
      const userInfo = app.globalData.userInfo;
      if (userInfo) { // 当用户通过正常的跳转进入该页面(用户信息已经获取并存储在globalData中)
        this.setData({ userInfo })
        resolve();
      } else {
        /*原本的实现，不知道什么意思*/
        app.userInfoCallback = userInfo => { // 这是个异步过程
          this.setData({ userInfo })
          resolve();
        }
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
  // 获取目的地址
  bindChooseDstLocation: function (id) {
    let _this = this;
    wx.getSetting({
      success(res) {
        // 判断定位的授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              _this.chooseLocation(id);
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
          _this.chooseLocation(id);
        }
      }
    })
  },
  // 获取出发地址
  bindChooseLocation: function (e) {
    let _this = this;
    var id = e.currentTarget.id;
    wx.getSetting({
      success(res) {
        // 判断定位的授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              _this.chooseLocation(id);
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
          _this.chooseLocation(id);
        }
      }
    })
  },
  // 获取地址
  chooseLocation(id) {
    const _this = this;
    var preLatitude = _this.data.trip[`${id}Latitude`];
    var preLongitude = _this.data.trip[`${id}Longitude`];
    console.log("chooselocation open lat=" + preLatitude + " lng=" + preLongitude);
    if (!preLatitude && !preLongitude) {//避免安卓打开0，0坐标的位置；
      wx.chooseLocation({
        success: function (res) {
          const key = `trip.${id}`,
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
    }
    else {
      wx.chooseLocation({
        latitude: preLatitude,
        longitude: preLongitude,
        success: function (res) {
          const key = `trip.${id}`,
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
    }
  },
})