const { default: mongoose } = require('mongoose');
const Comment = require('../models/CommentModel');

const getCommentByPostId = async (postId) => {
    let data = {};
    const newPostId = new mongoose.Types.ObjectId(postId);
    try {
        const dataComment = await Comment.aggregate([
            {
                $match: {
                    postId: newPostId,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'creatorInfo',
                },
            },
            {
                $project: {
                    _id: 1,
                    content: 1,
                    parrent: 1,
                    userId: { $arrayElemAt: ['$creatorInfo', 0] },
                    postId: 1,
                },
            },
            {
                $project: {
                    _id: 1,
                    content: 1,
                    parrent: 1,
                    postId: 1,
                    'userId.name': 1,
                    'userId.imgUrl': 1,
                    'userId._id': 1,
                },
            },
        ]).exec();
        if (dataComment) {
            data.errCode = 0;
            data.data = dataComment;
        } else {
            data.errCode = 1;
            data.message = 'nodata';
        }
    } catch (error) {
        data.errCode = 1;
        data.message = 'error: ' + error;
    }
    return data;
};
const addComment = async (commentData) => {
    let data = {};
    if (!commentData) {
        data.errCode = 2;
        data.message = 'no data comment';
    } else {
        try {
            const data1 = await Comment.create(commentData);
            console.log(data1);
            if (data) {
                data.errCode = 0;
                data.data = data1;
            } else {
                data.errCode = 1;
                data.message = 'not coneect to DB';
            }
        } catch (error) {
            data.errCode = 1;
            data.message = 'error: ' + error;
        }
    }

    return data;
};

module.exports = { getCommentByPostId, addComment };
