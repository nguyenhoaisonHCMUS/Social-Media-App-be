const Liked = require('../models/LikeModel');
const likePost = async (userId, postId) => {
    let data = {};
    try {
        const newLiked = await Liked.create({ postId: postId, userId: userId });
        if (newLiked) {
            data.errCode = 0;
            data.data = newLiked;
        } else {
            data.errCode = 1;
            data.message = 'failed 1';
        }
    } catch (error) {
        data.errCode = 2;
        data.message = 'failed:' + error;
    }
    return data;
};

const unLikePost = async (userId, postId) => {
    let data = {};
    try {
        const unLiked = await Liked.deleteMany({ postId: postId, userId: userId });
        console.log(unLiked);
        if (unLiked.acknowledged) {
            data.errCode = 0;
            data.data = unLiked;
        } else {
            data.errCode = 1;
            data.message = 'failed 1';
        }
    } catch (error) {
        data.errCode = 2;
        data.message = 'failed:' + error;
    }
    return data;
};

module.exports = {
    likePost,
    unLikePost,
};
