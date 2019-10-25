import { Token } from 'utils/token';
import { User } from 'utils/user';
import { TRIP_TYPE, ROLE_TYPES } from 'utils/constants';

App({
  onLaunch: function() {
    const token = wx.getStorageSync('token'); // 从缓存中读取token
    if (token) {
      this.__fetchUserinfo();
    } else {
      this.__fetchToken();
    }
  },

  // 从服务器获取用户信息
  __fetchUserinfo() {
    console.log('从服务器获取用户信息');
    const user = new User();
    user.get()
      .then(res => {
        this.globalData.userInfo = res.data.user; // 缓存用户信息
        if (this.userInfoCallback) { // 页面获取用户信息的回调
          this.userInfoCallback(res.data.user);
        }
      })
      .catch(error => {
        wx.showToast('获取用户信息失败');
      })
  },

  // 从服务器获取用户token
  __fetchToken() {
    console.log('从服务器获取token');
    const oToken = new Token();
    oToken.getTokenFromServer()
      .then(res => {
        wx.setStorageSync('token', res.token); // 缓存token
        this.globalData.userInfo = res.user; // 缓存用户信息
        if (this.userInfoCallback) { // 页面获取用户信息的回调
          this.userInfoCallback(res.openid);
        }
      })
      .catch(error => {
        console.log(error);
      })
  },
  userInfoCallback: function (e) {
    let _this = this;
    wx.getSetting({
      success(res) {
        // 判断定位的授权
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              _this.getUserInfo(e);
            },
            fail(errMsg) {
              wx.showModal({
                title: '获取用户信息失败！', //提示的标题,
                content: '请开启微信获取信息权限！', //提示的内容,
                showCancel: true, //是否显示取消按钮,
                cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
                cancelColor: '#000000', //取消按钮的文字颜色,
                confirmText: '获取信息', //确定按钮的文字，默认为取消，最多 4 个字符,
                confirmColor: '#3CC51F', //确定按钮的文字颜色,
                success: res => {
                  if (res.confirm) {
                    wx.openSetting({
                      success: res => {
                        console.log(res.authSetting);
                      }
                    });
                  } else if (res.cancel) {
                    console.log('用户拒绝获取信息');
                  }
                }
              });
            }
          })
        } else {
          _this.getUserInfo(e);
        }
      }
    })
  },
  getUserInfo(e) {
    let _this = this;
    wx.getUserInfo({
      success: function (res) {
        _this.globalData.userInfo = res.userInfo;
        console.log(res.userInfo);
      },
      fail: function (error) {
        console.log(error);
        console.log("获取失败");
      }
    });
  },
  globalData: {
    userInfo: null
  }
})
