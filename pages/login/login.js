require("../../utils/des.js");

Page({
    data: {
        number: "",
        password: "",
        isPhoneX: !1
    },
    username: function(t) {
        this.setData({
            number: t.detail.value
        });
    },
    password: function(t) {
        this.setData({
            password: t.detail.value
        });
    },
    onLoad: function(t) {
        this.setData({
            isPhoneX: getApp().globalData.isPhoneX
        });
    },
    begin: function() {
        var t = this;
        wx.showLoading({
            title: "用户登录中",
            mask: !0,
            success: function() {
             
              
                wx.request({
                    url: getApp().globalData.baseApiUri + "/login/ecnu",
                    method: "post",
                    header: {
                        "content-type": "application/x-www-form-urlencoded "
                    },
                    data: {
                        number: t.data.number,
                        password: t.data.password,
                        unionId: getApp().globalData.unionId
                    },
                    success: function(a) {
                        0 === a.data.code ? (a.data.result.institute = a.data.result.department.split("-")[0], 
                        a.data.result.department = a.data.result.department.split("-")[1], getApp().globalData.userInfo = a.data.result, 
                        wx.reLaunch({
                            url: "../step-confirm/index"
                          })) : wx.showModal({
                            title: "提示",
                            content: "用户名或密码错误！",
                            showCancel: !1,
                            success: function() {
                                t.setData({
                                    password: ""
                                });
                            }
                        });
                    },
                    fail: function(a) {
                        wx.showModal({
                            title: "提示",
                            content: "网络连接错误，请检查您的网络连接！",
                            showCancel: !1,
                            success: function() {
                                t.setData({
                                    password: ""
                                });
                            }
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                });
            }
        });
    },
    cancel: function() {
        wx.reLaunch({
            url: "../welcome"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});