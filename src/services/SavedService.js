const Saved = require('../models/SavedModel');
const savePost = async (userId, postId) => {
    let data = {};
    try {
        const newSaved = await Saved.create({ postId: postId, userId: userId });
        if (newSaved) {
            data.errCode = 0;
            data.data = newSaved;
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

const unSavePost = async (userId, postId) => {
    let data = {};
    try {
        const unSaved = await Saved.deleteMany({ postId: postId, userId: userId });
        console.log(unSaved);
        if (unSaved.acknowledged) {
            data.errCode = 0;
            data.data = unSaved;
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
    savePost,
    unSavePost,
};
