Page({
    data: {
        userInfo: getApp().globalData.userInfo,
        baseApiUrl: getApp().globalData.baseApiUri,
        imgShow: !1,
        isPhoneX: !1
    },
    error: function(e) {
        wx.hideLoading(), wx.showModal({
            title: "提示",
            content: e,
            showCancel: !1,
            success: function() {
                wx.reLaunch({
                    url: "../welcome"
                });
            }
        });
    },
    onShow: function() {
      /*
        wx.getLocation({
            success: function(e) {
                console.log("获取用户位置信息成功", e), getApp().globalData.lat = e.latitude, getApp().globalData.lon = e.longitude;
            },
            fail: function(e) {
                console.log("获取用户位置信息失败", e), wx.showModal({
                    title: "提示",
                    content: "获取您的位置信息失败，请检查您是否打开GPS开关！",
                    confirmText: "权限修改",
                    success: function(e) {
                        e.confirm && wx.openSetting();
                    }
                });
            }
        });*/
      getApp().globalData.lat = 121.446389,
      getApp().globalData.lon = 31.037778;
    },
    checkSession: function() {
      var e = this; e.getInfo();
        wx.checkSession({
            success: function() {
                console.log("session keep alive", wx.getStorageSync("sessionKey")), getApp().globalData.sessionKey = wx.getStorageSync("sessionKey"), 
                "" === wx.getStorageSync("sessionKey") ? e.initLogin() : e.getInfo();
            },
            fail: function() {
                console.log("session lose effectiveness"), getApp().globalData.userInfo = null, 
                getApp().globalData.sessionKey = "", e.initLogin();
            }
        });
    },
  initLogin: function () {
    console.log('initlogin')
      var e = this; e.getInfo();
        /**
        wx.login({
            success: function(t) {
                t.code ? wx.request({
                    url: getApp().globalData.baseApiUri + "/session",
                    data: {
                        js_code: t.code
                    },
                    success: function(t) {
                        console.log(t), 0 == t.data.code ? (wx.setStorageSync("sessionKey", t.data.result), 
                        getApp().globalData.sessionKey = t.data.result, e.getInfo()) : e.error("登录失败，请检查您的网络连接！");
                    },
                    fail: function(t) {
                        e.error("登录失败，请检查您的网络连接！");
                    }
                }) : e.error("网络连接错误，请检查您的网络连接！");
            },
            fail: function(t) {
                e.error("网络连接错误，请检查您的网络连接！");
            }
        }); */
    },
  register: function () {
    console.log('register')
        var e = this;
        console.log(getApp().globalData.userInfo.number)
        wx.showLoading({
            title: "信息核对中",
            mask: !0,
            success: function() {
                wx.request({
                    url: e.data.baseApiUrl + "/register",
                    method: "POST",
                    data: {
                      id: getApp().globalData.userInfo.number,
                        device: "WeChat",
                        location: {
                          x: 121.446389,
                          y: 31.037778
                        },
                        platform:'ios',// getApp().globalData.platform
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(e) {
                      console.log(e)
                      0 == e.data.code ? (getApp().globalData.verificationCode = e.data.result.code, getApp().globalData.reg = e.data.result.id, console.log(getApp().globalData.verificationCode),
                        wx.navigateTo({
                            url: "../step-validate/index"
                        })) : 1 == e.data.code ? wx.navigateTo({
                            url: "../success/success"
                        }) : wx.showModal({
                            title: "提示",
                            content:"1"+ e.data.message || "网络错误，请稍后重试！",
                            showCancel: !1
                        });
                    },
                    fail: function(e) {
                        console.log(e);
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                });
            }
        });
    },
    imgLoaded: function(e) {
        this.setData({
            imgShow: !0
        });
    },
    hint: function() {
        wx.showModal({
            title: "提示",
            content: "若非本人，请重新输入公共数据库账户和密码进行登录！",
            confirmText: "重新登录",
            success: function(e) {
                e.confirm && wx.redirectTo({
                    url: "../login/login"
                });
            }
        });
    },
    begin: function() {
        var e = this;
        wx.showLoading({
            title: "正在获取信息",
            mask: !0,
            success: function() {
                e.checkSession();
            }
        });
    },
    getInfo: function() {
      if (!getApp().globalData.number){
    wx.redirectTo({
      url: "../login/login"
    })};console.log('getinfo')
        /*
        wx.getUserInfo({
            success: function(t) {
                wx.request({
                    url: getApp().globalData.baseApiUri + "/user/new",
                    data: {
                        open_key: getApp().globalData.sessionKey,
                        iv: t.iv,
                        data: t.encryptedData,
                        number: getApp().globalData.number
                    },
                    success: function(t) {
                        console.log(t), 0 === t.data.code && null != t.data.result ? (t.data.result.institute = t.data.result.department.split("-")[0], 
                        t.data.result.department = t.data.result.department.split("-")[1], e.setData({
                            userInfo: t.data.result
                        }), getApp().globalData.userInfo = t.data.result, getApp().globalData.unionId = t.data.result.unionId) : -2 == t.data.code ? (getApp().globalData.unionId = t.data.result, 
                        wx.redirectTo({
                            url: "../login/login"
                        })) : (wx.clearStorageSync(), wx.showModal({
                            title: "提示",
                            content: "网络连接错误，请检查您的网络连接！",
                            showCancel: !1,
                            success: function() {
                                wx.reLaunch({
                                    url: "../welcome"
                                });
                            }
                        }));
                    },
                    fail: function(e) {
                        wx.showModal({
                            title: "提示",
                            content: "网络连接错误，请检查您的网络连接！",
                            showCancel: !1,
                            success: function() {
                                wx.reLaunch({
                                    url: "../welcome"
                                });
                            }
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                });
            },
            fail: function(t) {
                e.error("网络连接错误，请检查您的网络连接！");
            }
        });*/
    },
    onLoad: function(e) {
        console.log("onload", e);
        var t = this;
        t.setData({
            isPhoneX: getApp().globalData.isPhoneX
        }), e.number ? (getApp().globalData.number = e.number, t.begin()) : null !== getApp().globalData.userInfo ? t.setData({
            userInfo: getApp().globalData.userInfo
        }) : t.begin();
    },
    getQueryString: function(e, t) {
        var o = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"), a = e.split("?")[1].match(o);
        return null != a ? unescape(a[2]) : null;
    }
});