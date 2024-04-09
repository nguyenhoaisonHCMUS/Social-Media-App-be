const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SavedSchema = new Schema({
    postId: { type: ObjectId, ref: 'Post' },
    userId: { type: ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Saved', SavedSchema);
