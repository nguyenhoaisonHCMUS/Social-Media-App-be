const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CommentSchema = Schema({
    postId: { type: ObjectId, ref: 'Post' },
    userId: { type: ObjectId, ref: 'User' },
    content: { type: String },
    parrent: { type: String, default: '' },
});

module.exports = mongoose.model('Comment', CommentSchema);
