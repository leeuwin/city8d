Page({
  data: {
    showTopTips: false,
    seatItems: [1, 2, 3, 4, 5, 6],
    seatItemsIndex: 0,

    isAgree: false,
    formData: {
      seat: 1
    },
    rules: [{
      name: 'seat',
      rules: { required: true, message: '请选择[座位数量]' },
    }, {
      name: 'from',
      rules: { required: true, message: '请用地图标记[上车点]' },
    }, {
      name: 'dest',
      rules: { required: true, message: '请用地图标记[下车点]' },
    }],
    trip: {
      fromAddrName: '在哪里上车', // 出发地名称
      fromAddress: '', // 出发地地址
      fromLongitude: null, // 出发地经度
      fromLatitude: null, // 出发地纬度
      destAddrName: '到哪里下车', // 名称
      destAddress: '', // 地址
      destLongitude: null, // 经度
      destLatitude: null, // 纬度
    },
  },

  bindSeatChange(e) {
    this.setData({
      seatItemsIndex: e.detail.value,
      [`formData.seat`]: e.detail.value
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        wx.showToast({
          title: '下单成功!'
        });
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/mytrip/mytrip'
          })
        }, 1000);
      }
    })
  },
  cancelForm()
  {
    wx.navigateBack();
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
            [latitude]: res.latitude,
            [`formData.${id}`]: 1
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
            [latitude]: res.latitude,
            [`formData.${id}`]: 1
          });
        },
        fail: function (error) {
          console.log(error);
          console.log("获取失败");
        }
      });
    }
  },
});