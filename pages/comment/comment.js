var requests = require('../../requests/request.js');
var app = getApp();

var commentPageSize = 10;
var commentPageIndex = 0;

var getCommentList = function (that, momentId) {
    that.setData({
        loadingHidden: false
    });
    // 根据momentId 获取评论列表
    requests.getCommentListByMomentId(momentId, commentPageIndex, commentPageSize, function (result) {
        console.log(result);
        // 获取评论列表
        var list = that.data.commentInfoList;
        // 获取新请求的评论列表
        var commentInfoList = result.content.commentInfoList;
        // 添加新增的gif
        for (var i = 0; i < commentInfoList.length; i++) {
            // 播放按钮
            commentInfoList[i].playIconUrl = "../../images/play.png";
            commentInfoList[i].playIconHidden = "";

            list.push(commentInfoList);
        }

        that.setData({
            commentInfoList: list
        });
    });
    commentPageIndex++;
    that.setData({
        loadingHidden: true
    });
}
// 获取momentId 详情
var getMomentInfo = function (that, momentId) {

    // 请求moment详情
    requests.getMomentsDetail(momentId, function (result) {
        console.log(result);
        result.content.momentInfo.showUrl = result.content.momentInfo.fileUrl;
        that.setData({
            momentInfo: result.content.momentInfo
        });
    });
}
Page({
    // 数据绑定
    data: {
        userInfo: {},
        momentInfo: {},
        commentInfoList: [],
        loadingHidden: true,
        scrollTop: 0,
        scrollHeight: 0
    },
    // 初始化时调用
    onLoad: function (option) {
        var that = this;
        console.log(option);
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
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        });
        // 获取评论列表
        getCommentList(that, option.momentId);
        // 获取评论列表
        getMomentInfo(that, option.momentId);
    },
    // 评论信息
    addComment: function (e) {
        console.log(e);
        var that = this;
        var commentContent = e.detail.value;
        var momentInfo = that.data.momentInfo;
        var userInfo = that.data.userInfo;
        var commentInfoList = that.data.commentInfoList;
        requests.addComment({
            "commentContent": commentContent,
            "userId": userInfo.userId,
            "userNickName": userInfo.userNickName,
            "userImageUrl": userInfo.imageUrl,
            "momentId": momentInfo.momentId,
        }, function (result) {
            commentInfoList.push(result.content.commentInfo);
            that.setData({
                commentInfoList: commentInfoList
            });
        });

    }
});