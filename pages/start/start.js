//login.js
//获取应用实例
var app = getApp();
Page({
    data: {
        remind: '加载中',
        angle: 0,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    goToIndex: function () {
        if (app.globalData.userInfo){
            wx.switchTab({
                url: '/pages/index/index',
            });
        }else{
          this.showAuthModel();
        }
    },
    onLoad: function () {
        var that = this;
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else {
            this.login();
        }
    
    },
    onShow: function () {

    },
    onReady: function () {
        var that = this;
        setTimeout(function () {
            that.setData({
                remind: ''
            });
        }, 1000);
        wx.onAccelerometerChange(function (res) {
            var angle = -(res.x * 30).toFixed(1);
            if (angle > 14) {
                angle = 14;
            }
            else if (angle < -14) {
                angle = -14;
            }
            if (that.data.angle !== angle) {
                that.setData({
                    angle: angle
                });
            }
        });
    },
    login: function () {
        var that = this;
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.getUserInfo({
                    success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        app.globalData.userInfo = res.userInfo
                        that.setData({
                          userInfo: res.userInfo,
                          hasUserInfo: true
                        })
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (this.userInfoReadyCallback) {
                            this.userInfoReadyCallback(res)
                        }
                    }, fail: function () {
                        that.showAuthModel();
                    }
                })
            }
        })
    },
    showAuthModel: function () {
        wx.showModal({
            title: '警告通知',
            content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
            success: function (res) {
                if (!res.confirm) {
                    console.log("未授权");
                } else {
                    wx.openSetting({
                        success: function (data) {
                            if (data) {
                                if (data.authSetting["scope.userInfo"] == true) {
                                    wx.getUserInfo({
                                        success: res => {
                                            // 可以将 res 发送给后台解码出 unionId
                                            app.globalData.userInfo = res.userInfo

                                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                            // 所以此处加入 callback 以防止这种情况
                                            if (this.userInfoReadyCallback) {
                                                this.userInfoReadyCallback(res)
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
    }
});