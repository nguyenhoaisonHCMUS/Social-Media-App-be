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
                $lookup: {
                    from: 'saveds', // Tên của collection Like
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'saveds',
                },
            },
            {
                $lookup: {
                    from: 'comments', // Tên của collection Like
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'comments',
                },
            },
            {
                $project: {
                    _id: 1,
                    caption: 1,
                    tags: 1,
                    imgUrl: 1,
                    location: 1,
                    cre_at: 1,
                    creator: { $arrayElemAt: ['$creatorInfo', 0] },
                    likes: '$likes.userId',
                    saveds: '$saveds.userId',
                    comments: '$comments.userId',
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

const getOfUser = async (userId) => {
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    let data = {};
    try {
        const results = await Post.aggregate([
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
                $lookup: {
                    from: 'saveds', // Tên của collection Like
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'saveds',
                },
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'comments',
                },
            },
            {
                $project: {
                    _id: 1,
                    caption: 1,
                    tags: 1,
                    imgUrl: 1,
                    location: 1,
                    cre_at: 1,
                    creator: { $arrayElemAt: ['$creatorInfo', 0] },
                    likes: '$likes.userId',
                    saveds: '$saveds.userId',
                    comments: '$comments.userId',
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

const getOfCaption = async (caption) => {
    let data = {};
    try {
        const dataPost = await Post.find({ caption: { $regex: caption, $options: 'i' } });
        if (dataPost) {
            data.errCode = 0;
            data.data = dataPost;
        } else {
            data.errCode = 1;
            data.data = 'no data from DB';
        }
    } catch (error) {
        data.errCode = 1;
        data.message = 'error: ' + error;
    }
    return data;
};
const getOfID = async (postId) => {
    let data = {};
    const newPostId = new mongoose.Types.ObjectId(postId);
    try {
        const dataPost = await Post.aggregate([
            {
                $match: { _id: newPostId },
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
                $lookup: {
                    from: 'saveds', // Tên của collection Like
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'saveds',
                },
            },
            {
                $lookup: {
                    from: 'comments', // Tên của collection Like
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'comments',
                },
            },
            {
                $project: {
                    _id: 1,
                    caption: 1,
                    tags: 1,
                    imgUrl: 1,
                    location: 1,
                    cre_at: 1,
                    creator: { $arrayElemAt: ['$creatorInfo', 0] },
                    likes: '$likes.userId',
                    saveds: '$saveds.userId',
                    comments: '$comments.userId',
                },
            },
        ]).exec();

        if (dataPost) {
            data.errCode = 0;
            data.data = dataPost;
        } else {
            data.errCode = 1;
            data.data = 'no data from DB';
        }
    } catch (error) {
        data.errCode = 1;
        data.message = 'error: ' + error;
    }
    return data;
};

module.exports = { getAll, createPost, getOfUser, getOfCaption, getOfID };
