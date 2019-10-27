import { Token } from 'utils/token';
import { User } from 'utils/user';
import { TRIP_TYPE, ROLE_TYPES } from 'utils/constants';

App({
  onLaunch: function() {
    var token = '';
    //token = wx.getStorageSync('token'); // 从缓存中读取token
    if (token) 
    {
      console.log(token);
      this.__fetchUserinfo();
    } 
    else 
    {
      console.log("token is not exist,ready fetch from server!");
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
        console.log("fetch token succeed"+res.token);
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
  globalData: {
    userInfo: null
  }
})
