var requests = require('../../requests/request.js');
var util = require('../../utils/util.js');

var app = getApp();
// 获取moment 列表
var getMomentList = function (that) {
    that.setData({
        loadingHidden: false
    });
    requests.getMomentsList(function (result) {
        var list = that.data.momentInfoList;
        for (var i = 0; i < result.content.momentInfoList.length; i++) {
            result.content.momentInfoList[i].playIconUrl = "../../images/play.png";
            result.content.momentInfoList[i].playIconHidden = "";
            list.push(result.content.momentInfoList[i]);
        }
        that.setData({
            momentInfoList: list
        });
        that.setData({
            loadingHidden: true
        });
    });
};
// 播放状态 0 播放,1暂停
var playStatue = 0;
// 更改moment状态
var changeMomentList = function (that, momentId, type) {
    var list = that.data.momentInfoList;
    for (var i = 0; i < list.length; i++) {
        if (list[i].momentId == momentId) {
            // 赞
            if (type == 1) {
                var storeKey = momentId + "_zan";
                var value = wx.getStorageSync(storeKey);
                if (value) {
                    wx.showToast({title: "已经赞过了", icon: 'success', duration: 2000});
                } else {
                    requests.addMomentUpCount(momentId, function (result) {
                        list[i].upCount = result.content.upCount;
                        list[i].upIconUrl = result.content.upIconUrl;
                        wx.setStorageSync(storeKey, momentId);
                        that.setData({
                            momentInfoList: list
                        });
                    });
                }
            }
            // 踩
            if (type == 2) {
                var storeKey = momentId + "_cai";
                var value = wx.getStorageSync(storeKey);
                if (value) {
                    wx.showToast({title: "已经踩过了", icon: 'success', duration: 2000});
                } else {
                    requests.addMomentDownCount(momentId, function (result) {
                        list[i].downCount = result.content.downCount;
                        list[i].downIconUrl = result.content.downIconUrl;
                        wx.setStorageSync(storeKey, momentId);
                        that.setData({
                            momentInfoList: list
                        });
                    });
                }
            }
            // 播放
            if (type == 3) {
                var status = playStatue % 2 == 0 ? true : false;
                playStatue++;
                if (status) {
                    // 加载gif
                    list[i].fileCoverUrl = list[i].fileSourceUrl+"?num="+Math.random();
                    list[i].playIconHidden = "display:none";
                } else {
                    list[i].fileCoverUrl = list[i].fileSourceCoverUrl;
                    list[i].playIconHidden = "";
                }
                that.setData({
                    momentInfoList: list
                });
            }
            break;
        }
    }
}

Page({
    // 数据绑定
    data: {
        userInfo: {},
        momentInfoList: [],
        loadingHidden: true,
        scrollTop: 0,
        scrollHeight: 0
    },
    // 初始化时调用
    onLoad: function () {
        console.log('onLoad');
        var that = this;
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        });
        //   这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件
        // ，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
        wx.getSystemInfo({
            success: function (res) {
                console.info(res.windowHeight);
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });
    },
    // 展示时调用
    onShow: function () {
        var that = this;
        getMomentList(that);
    },
    // 点赞
    btnUpMomentCount: function (e) {
        var that = this;
        var momentId = e.currentTarget.dataset.index;
        console.log(e);
        changeMomentList(that, momentId, 1);
    },
    // 踩
    btnDownMomentCount: function (e) {
        var that = this;
        var momentId = e.currentTarget.dataset.index;
        changeMomentList(that, momentId, 2);
    },
    // 播放moment
    btnPlayMoment: function (e) {
        var that = this;
        var momentId = e.currentTarget.dataset.index;
        changeMomentList(that, momentId, 3);
    },
    // 加载更多
    loadMoreList: function (e) {
        var that = this;
        getMomentList(that);
    }
})