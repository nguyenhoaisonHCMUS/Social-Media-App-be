const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const LikeSchema = new Schema({
    postId: { type: ObjectId, ref: 'Post' },
    userId: { type: ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Like', LikeSchema);
