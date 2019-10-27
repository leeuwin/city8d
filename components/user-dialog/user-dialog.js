import { User } from '../../utils/user';

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    cancelText: String,
    confirmText: String
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    cancelAction: function(e) {
      // const formId = e.detail.formId || '';
      // this.triggerEvent('cancel', { formId });
      console.log('取消')
    },
    confirmAction: function(e) {
      // const formId = e.detail.formId || '';
      // this.triggerEvent('cancel', { formId });
      console.log('确认')
    },
    // 获取用户头像信息
    bindGetUserInfo(e) {
      const userInfo = e.detail.userInfo;
      if (userInfo) {
        const user = new User();
        user.update(userInfo)
          .then(res => {
            this.triggerEvent('update', { user: res.data.user });
          })
      }
    },
    /*
    bindGetUserInfo: function (e) {
      let _this = this;
      wx.getSetting({
        success(res) {
          // 判断用户信息的授权
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
        lang: 'zh_CN',
        success: function (res) {
          const userInfo = res.userInfo;
          console.log(userInfo);
          const user = new User();
          user.update(userInfo)
            .then(res => {
              const userInfo = res.data.user;
             // app.globalData.userInfo = userInfo; // 更新用户信息
              _this.setData({
                userInfo
              })
              this.setUserStatus(userInfo);
            })
        },
        fail: function (error) {
          console.log(error);
        }
      });
    },*/
  }
})
