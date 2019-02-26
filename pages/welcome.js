Page({
    data: {
        isPhoneX: !1
    },
    onGotUserInfo: function(e) {
        e.detail.errMsg.indexOf("ok") > 0 && wx.navigateTo({
            url: "step-confirm/index"
        });
    },
    onShareAppMessage: function() {},
    onLoad: function() {
        var e = this;
        wx.getSystemInfo({
            success: function(o) {
                -1 != o.model.indexOf("iPhone X") && (getApp().globalData.isPhoneX = !0), e.setData({
                    isPhoneX: getApp().globalData.isPhoneX
                }), console.log(e.data.isPhoneX);
            }
        });
    }
});