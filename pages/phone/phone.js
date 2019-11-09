import {
  Phone
} from './phone-model.js';

const app = getApp();

Page({
  data: {
    from: '',
    phone: '',
    formData: {},
    rules: [{
      name: 'phone',
      rules: [{
        required: true,
        message: '请输入手机号'
      }, {
          mobile: true,
          message: '手机号格式不对'
        }]
    }, {
      name: 'vcode',
      rules: {
        required: true,
        message: '请输入验证码'
      },
    }],
  },
  onLoad: function(options) {
    const from = options.from
    if (from) {
      this.setData({
        from
      });
    }
  },
  bindKeyInput: function(e) {
    console.log(e);
    this.setData({
      [`${e.target.id}`]: e.detail.value,
      [`formData.${e.target.id}`]: e.detail.value
    })
  },
  cancelForm(e) {
    wx.navigateBack({
    });
  },
  submitForm(e) {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        let phone = new Phone();
        phone.binding({
            phone: this.data.phone
          })
          .then(res => {
            app.globalData.userInfo = res.data.user;
            wx.showToast({
              title: '手机绑定成功!',
              duration: 1000
            });
            setTimeout(() => {
              wx.navigateBack({
              });
            }, 1500);
             /* wx.showModal({
                title: '提示',
                content: '绑定成功, 通过实名认证之后才能发布行程哦！',
                confirmText: '实名认证',
                success: res => {
                    wx.navigateBack({
                    });
                }
              })*/
            
          })
          .catch(error => {
            wx.showToast({
              title: '手机绑定失败!',
              duration: 1500
            });
          });
      }
    });
  }
})