Page({
    data: {
        codes: "",
        timerHandle: null,
        cameraHandle: null,
        timer: 0,
        src: null,
        image: null,
        progress: 0,
        button_image: "VideoButton.png",
        button_active: ""
    },
    _doUploadImage: function() {
        console.log("开始上传图片");
        var e = this;
        wx.uploadFile({
            url: getApp().globalData.baseApiUri + "/register/validate",
            filePath: this.data.image,
            header: {
                "content-type": "multipart/form-data"
            },
            name: "image",
            formData: {
                user: getApp().globalData.userInfo.number,
                type: "image",
                registration: getApp().globalData.reg
            },
            success: function(t) {
                var o = JSON.parse(t.data);
                console.log(o), "SUCCESS" === o.result ? e._doUploadVideo() : (wx.hideLoading(), 
                wx.showModal({
                    title: "报到失败",
                    content: o.message,
                    showCancel: !1
                }));
            },
            fail: function(e) {
                console.log(e), wx.hideLoading(), wx.showModal({
                    title: "提示",
                    content: "网络连接错误，请检查您的网络连接！",
                    showCancel: !1,
                    success: function(e) {
                        wx.reLaunch({
                            url: "../welcome"
                        });
                    }
                });
            }
        });
    },
    _doUploadVideo: function() {
        console.log("开始上传视频"), wx.showLoading({
            title: "正在核对视频"
        });
        wx.uploadFile({
            url: getApp().globalData.baseApiUri + "/register/validate",
            filePath: this.data.src,
            header: {
                "content-type": "multipart/form-data"
            },
            name: "video",
            formData: {
                user: getApp().globalData.userInfo.number,
                type: "video",
                registration: getApp().globalData.reg
            },
            success: function(e) {
                var t = JSON.parse(e.data);
                console.log("上传视频成功"), console.log("上传视频成功的返回数据：", t), "SUCCESS" === t.result ? (console.log("报到成功"), 
                wx.reLaunch({
                    url: "../success/success"
                })) : (console.log("报到失败"), wx.showModal({
                    title: "报到失败",
                    content: t.message,
                    showCancel: !1,
                    success: function(e) {
                        wx.reLaunch({
                            url: "../welcome"
                        });
                    }
                }));
            },
            fail: function(e) {
                console.log("失败"), console.log("上传视频失败的返回数据：", e), wx.showModal({
                    title: "提示",
                    content: "网络连接错误，请检查您的网络连接！",
                    showCancel: !1,
                    success: function(e) {
                        wx.reLaunch({
                            url: "../welcome"
                        });
                    }
                });
            },
            complete: function(e) {
                console.log(e), wx.hideLoading();
            }
        });
    },
    onShow: function() {
        console.log(getApp().globalData.verificationCode), this.setData({
            codes: getApp().globalData.verificationCode
        });
    },
    _doUpdateTimer: function() {
        this.setData({
            timer: (this.data.timer || 0) - 1
        }), console.log("Line62", "_doUpdateTimer", this.data.timer), this.data.timer <= 0 && (this.setData({
            button_image: "VideoButton.png",
            button_active: ""
        }), this.stop());
    },
    stop: function() {
        var e = this;
        console.log("this.data.timerHandle:", this.data.timerHandle), this.data.timerHandle && (clearInterval(this.data.timerHandle), 
        this.setData({
            timerHandler: null
        })), this.data.cameraHandle && this.data.cameraHandle.stopRecord({
            success: function(t) {
                console.log("调用结束录制接口成功：", t), e.setData({
                    src: t.tempVideoPath,
                    image: t.tempThumbPath
                }), wx.showModal({
                    title: "提示",
                    content: "视频已经录制完成，请确认是否提交您的认证录像。",
                    showCancel: !0,
                    cancelText: "重新录制",
                    confirmText: "确认提交",
                    success: function(t) {
                        console.log(t), t.confirm ? (console.log("用户点击确认提交"), wx.showLoading({
                            title: "正在核对身份"
                        }), e._doUploadImage()) : t.cancel && (console.log("用户点击取消"), e.onShow());
                    }
                });
            },
            fail: function(e) {
                console.log("调用结束录制接口失败：", e);
            },
            complete: function(e) {
                console.log("调用结束录制接口：", e);
            }
        });
    },
    start: function() {
        var e = this, t = wx.createCameraContext();
        t.startRecord({
            success: function(o) {
                console.log("res和page信息：   ", o, e), e.setData({
                    timerHandle: setInterval(e._doUpdateTimer, 1e3),
                    timer: 4,
                    cameraHandle: t,
                    button_image: "VideoButtonActive.png",
                    button_active: "active"
                });
            },
            fail: function(e) {
                console.log("如果开始录制视频失败：", e), wx.showModal({
                    title: "提示",
                    content: "视频无法录制，请检查权限设置！",
                    confirmText: "权限修改",
                    success: function(e) {
                        e.confirm && wx.openSetting();
                    }
                });
            },
            complete: function(e) {
                console.log("开始录制视频按钮调用（无论成功或失败）:", e);
            }
        }), console.log("Line100:", "wx.createCameraContext", t);
    },
    error: function(e) {
        console.log(e.detail), wx.showModal({
            title: "提示",
            content: "获取摄像头权限失败，将无法使用后续功能！",
            confirmText: "权限修改",
            success: function(e) {
                e.confirm ? wx.openSetting({
                    success: function(e) {
                        wx.redirectTo({
                            url: "index"
                        });
                    }
                }) : wx.navigateBack();
            }
        });
    }
});