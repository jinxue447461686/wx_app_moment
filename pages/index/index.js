var requests = require('../../requests/request.js');
var util = require('../../utils/util.js');

var app = getApp();

var isStarted = true;
// 获取moment 列表
var getMomentList = function (that) {
    that.setData({
        loadingHidden: false
    });
    requests.getMomentsList(function (result) {
        var list = that.data.momentInfoList;
        // 添加新增的gif
        for (var i = 0; i < result.content.momentInfoList.length; i++) {
            // 播放按钮
            result.content.momentInfoList[i].playIconUrl = "../../images/play.png";
            result.content.momentInfoList[i].playIconHidden = "";
            // 图片地址
            result.content.momentInfoList[i].showUrl = result.content.momentInfoList[i].fileCoverUrl;

            list.push(result.content.momentInfoList[i]);
        }
        that.setData({
            momentInfoList: list
        });
    });
    that.setData({
        loadingHidden: true
    });
};

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
                break;
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
                break;
            }
        }
        // gif播放
        if (type == 3) {
            // 只加载播放的gif,其余的关闭加载
            if (list[i].momentId == momentId) {
                var playStatus = list[i].playIconHidden;
                if (playStatus == "") {
                    // 加载gif
                    list[i].showUrl = list[i].fileUrl;
                    list[i].playIconHidden = "display:none";
                } else {
                    // 关闭加载gif
                    list[i].showUrl = list[i].fileCoverUrl;
                    list[i].playIconHidden = "";
                }
            } else {
                list[i].playIconUrl = "../../images/play.png";
                list[i].playIconHidden = "";
                list[i].showUrl = list[i].fileCoverUrl;
            }
            that.setData({
                momentInfoList: list
            });
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
        var that = this;
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
        getMomentList(that);
    },
    // 展示时调用
    onShow: function () {
        console.log("显示页面");
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
    // 评论信息
    btnComment: function (e) {
        var that = this;
        var momentId = e.currentTarget.dataset.index;
        wx.navigateTo({url: "/pages/comment/comment?momentId=" + momentId});
    },
    // 分享信息
    btnShareMoment: function (e) {
        var that = this;
    },
    // 加载更多
    loadMoreList: function (e) {
        var that = this;
        getMomentList(that);
    }
})