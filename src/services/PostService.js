const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const Like = require('../models/LikeModel');
const mongoose = require('mongoose');

const getAll = async () => {
    let data = {};
    try {
        const results = await Post.aggregate([
            {
                $lookup: {
                    from: 'users', // Tên của collection User
                    localField: 'creator',
                    foreignField: '_id',
                    as: 'creatorInfo',
                },
            },
            {
                $lookup: {
                    from: 'likes', // Tên của collection Like
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'likes',
                },
            },
            {
                $project: {
                    _id: 1,
                    caption: 1,
                    tags: 1,
                    imgUrl: 1,
                    location: 1,
                    creator: { $arrayElemAt: ['$creatorInfo', 0] },
                    likes: '$likes.userId',
                },
            },
        ]).exec();

        if (results) {
            data.errCode = 0;
            data.message = 'success';
            data.posts = results;
        } else {
            data.errCode = 2;
            data.message = 'no data';
        }
    } catch (error) {
        data.errCode = 1;
        data.message = 'error111: ' + err;
    }

    return data;
};

const getAllx = async () => {
    try {
        const data = await Post.find({}).exec();
        return data;
    } catch (error) {
        return {};
    }
};

const createPost = async (postData) => {
    let data = {};
    try {
        console.log(1);
        if (!postData) {
            data.message = 'no data cp';
            data.errCode = 2;
        } else {
            const post = await Post.create(postData);
            data.errCode = 0;
            data.post = post;
        }
    } catch (error) {
        data.message = 'ERROR:' + error;
        data.errCode = 1;
        console.log(5);
    }
    return data;
};
const createPost111 = async (postData) => {
    try {
        const post = await Post.create(postData);
        return post;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getOfUser = async (userId) => {
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    let data = {};
    try {
        const results = await Post.aggregate([
            {
                $addFields: {
                    postId: '$_id', // Tạo một trường mới tạm thời để so sánh
                },
            },
            {
                $match: {
                    $expr: { $eq: ['$creator', userIdObjectId] }, // So sánh postId với postObjectId
                },
            },
            {
                $lookup: {
                    from: 'users', // Tên của collection User
                    localField: 'creator',
                    foreignField: '_id',
                    as: 'creatorInfo',
                },
            },
            {
                $lookup: {
                    from: 'likes', // Tên của collection Like
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'likes',
                },
            },
            {
                $project: {
                    _id: 1,
                    caption: 1,
                    tags: 1,
                    imgUrl: 1,
                    location: 1,
                    creator: { $arrayElemAt: ['$creatorInfo', 0] },
                    likes: '$likes.userId',
                },
            },
        ]).exec();

        if (results) {
            data.errCode = 0;
            data.posts = results;
        } else {
            data.errCode = 1;
            data.message = 'failed!!!';
        }
    } catch (error) {
        console.log(error);
        data.message = 'not connect to DB';
        data.errCode = 2;
    }

    return data;
};

module.exports = { getAll, createPost, createPost111, getOfUser, getAllx };
