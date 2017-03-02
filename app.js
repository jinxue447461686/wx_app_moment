var requests = require('./requests/request.js');

//app.js
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
    },
    getUserInfo: function (cb) {
        var that = this;
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            console.log(res);
                            // 添加用户信息
                            requests.addUserInfo({
                                "userNickName": res.userInfo.nickName,
                                "imageUrl": res.userInfo.avatarUrl,
                                "gender": res.userInfo.gender,
                                "userAccount": "",
                                "token": "",
                                "city": res.userInfo.city,
                                "province": res.userInfo.province
                            }, function (result) {
                                var userInfo = result.content.userInfo;
                                that.globalData.userInfo = userInfo;
                                console.log(userInfo);
                                typeof cb == "function" && cb(that.globalData.userInfo);
                            });
                        }
                    })
                }
            });
        }
    },
    // 分享
    onShareAppMessage: function () {
        return {
            title: '搞笑动态图',
            desc: '和你一起分享我们的瞬间',
            path: '/pages/index'
        }
    },
    globalData: {
        userInfo: null
    }
})