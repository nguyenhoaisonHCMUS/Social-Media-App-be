const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    name: { type: String },
    email: { type: String },
    imgUrl: { type: String, default: null },
    password: { type: String },
    username: { type: String },
});

module.exports = mongoose.model('User', User);
