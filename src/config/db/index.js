const mongoose = require('mongoose');

const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/socialmedia');

        console.log('successfully');
    } catch (error) {
        console.log('failed', error);
    }
};

module.exports = { connectToMongoDB };
