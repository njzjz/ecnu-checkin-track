App({
    globalData: {
        baseUri: "https://face-reg.ecnu.edu.cn",
        baseApiUri: "https://face-reg.ecnu.edu.cn/api",
        userInfo: null,
        number: "",
        verificationCode: "",
        sessionKey: "",
        lat: 0,
        lon: 0,
        reg: "",
        wifi: !0,
        paltform: "",
        isPhoneX: !1
    },
    onLaunch: function() {
        var e = this;
        wx.getSystemInfo({
            success: function(a) {
                e.globalData.platform = a.platform;
            }
        });
    }
});