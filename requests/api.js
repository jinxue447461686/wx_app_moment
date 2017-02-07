const API_BASE = 'https://www.vuouv.com/api';
//const API_BASE = 'http://localhost:1111/api';

const API_V1 = API_BASE + '/v1';
// moment
const MOMENTS = API_V1 + "/moments";
// 用户
const USERS = API_V1 + "/users";
// 评论
const COMMENTS = API_V1 + "/comments";

function moments() {
    return MOMENTS;
}
// 根据momentId 获取列表
function getMomentsDetail(momentId) {
    return MOMENTS + "/" + momentId;
}

function momentsUp(momentId) {
    return MOMENTS + "/" + momentId + "/up";
}

function momentsDown(momentId) {
    return MOMENTS + "/" + momentId + "/down";
}

function momentsShare(momentId) {
    return MOMENTS + "/" + momentId + "/share";
}

function users() {
    return USERS;
}

// 根据token 获取用户信息
function getUserInfoByToken(token) {
    return USERS + "/token/" + token;
}

function comments() {
    return COMMENTS;
}
// 根据momentId 获取评论列表
function getCommentsByMomentId(momentId) {
    return COMMENTS + "/moments/" + momentId;
}


module.exports = {
    moments: moments,
    users: users,
    getMomentsDetail: getMomentsDetail,
    getUserInfoByToken: getUserInfoByToken,
    comments: comments,
    getCommentsByMomentId: getCommentsByMomentId,
    momentsUp: momentsUp,
    momentsDown: momentsDown,
    momentsShare: momentsShare
}




