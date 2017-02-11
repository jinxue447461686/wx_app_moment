var util = require('../utils/util.js');
var api = require('api.js');

/**
 * 网络请求方法
 * @param url {string} 请求url
 * @param data {object} 参数
 * @param successCallback {function} 成功回调函数
 * @param errorCallback {function} 失败回调函数
 * @param completeCallback {function} 完成回调函数
 * @returns {void}
 */
function requestData(url, header, method, data, successCallback, errorCallback, completeCallback) {

    wx.request({
        url: url,
        data: data,
        header: header,
        method: method,
        success: function (res) {
            if (res.statusCode == 200)
                util.isFunction(successCallback) && res.data.ret && successCallback(res.data);
            else
                util.isFunction(errorCallback) && errorCallback();
        },
        error: function () {
            util.isFunction(errorCallback) && errorCallback();
        },
        complete: function () {
            util.isFunction(completeCallback) && completeCallback();
        }
    });
}
// 响应报错时,统一处理函数
function errorCommCallback() {
    console.log('response error');
}

// 响应完成时,统一处理函数
function completeCommCallback() {
    console.log('response complete');
}

// 响应成功时,统一处理函数
function successCommCallback(res) {
    console.log('response success');
    console.log(res);
}

function requestGet(url, params, successCallback, errorCallback, completeCallback) {
    requestData(url, {'Content-Type': 'application/json'}, 'GET', params, successCallback, errorCallback, completeCallback);
}

function requestPost(url, params, successCallback, errorCallback, completeCallback) {
    requestData(url, {'Content-Type': 'application/json'}, 'POST', params, successCallback, errorCallback, completeCallback);
}

function requestPut(url, params, successCallback, errorCallback, completeCallback) {
    requestData(url, {'Content-Type': 'application/json'}, 'PUT', params, successCallback, errorCallback, completeCallback);
}

function requestDelete(url, params, successCallback, errorCallback, completeCallback) {
    requestData(url, {'Content-Type': 'application/json'}, 'DELETE', params, successCallback, errorCallback, completeCallback);
}

// 获取moment列表
function getMomentsList(successCallback) {
    requestGet(api.moments(), {}, successCallback, errorCommCallback, completeCommCallback);
}

// 获取moment详情
function getMomentsDetail(momentId) {
    requestGet(api.moments() + momentId, {}, successCommCallback, errorCommCallback, completeCommCallback);
}

// 添加用户信息
function addUserInfo(userInfo) {
    requestPost(api.users(), userInfo, successCommCallback, successCommCallback, errorCommCallback, completeCommCallback);
}

// 根据token获取用户信息
function getUserInfoByToken(token) {
    requestGet(api.getUserInfoByToken(token), {}, successCommCallback, errorCommCallback, completeCommCallback);
}

// 增moment赞数量
function addMomentUpCount(momentId,successCallBack) {
    requestPut(api.momentsUp(momentId), {}, successCallBack, errorCommCallback, completeCommCallback);
}

// 增moment踩数量
function addMomentDownCount(momentId,successCallBack) {
    requestPut(api.momentsDown(momentId), {}, successCallBack, errorCommCallback, completeCommCallback);
}

// 增moment分享数量
function addMomentShareCount(momentId,successCallBack) {
    requestPut(api.momentsShare(momentId), {}, successCallBack, errorCommCallback, completeCommCallback);
}

// 添加moment评论
function addComment(commentInfo,successCallBack) {
    requestPost(api.comments(), commentInfo, successCallBack, errorCommCallback, completeCommCallback);
}

module.exports = {
    getMomentsList: getMomentsList,
    getMomentsDetail: getMomentsDetail,
    getUserInfoByToken: getUserInfoByToken,
    addUserInfo: addUserInfo,
    addMomentUpCount: addMomentUpCount,
    addMomentDownCount: addMomentDownCount,
    addMomentShareCount: addMomentShareCount,
    addComment: addComment
}