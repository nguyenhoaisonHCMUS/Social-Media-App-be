const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PostSchema = new Schema({
    caption: { type: String },
    tags: { type: String, default: '' },
    imgUrl: { type: String, default: null },
    location: { type: String },
    creator: { type: ObjectId, ref: 'User' },
    cre_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
