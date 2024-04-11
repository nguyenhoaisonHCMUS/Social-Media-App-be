const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const checkUserEmail = async (userEmail) => {
    const existingUser = await User.findOne({ email: userEmail });
    return existingUser;
};

const handleLogin = async (email, password) => {
    let userData = {};
    try {
        const user = await checkUserEmail(email);
        if (!user) {
            userData.errCode = 1;
            userData.message = 'No user found';
            userData.user = null;
        } else {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                userData.errCode = 0;
                userData.message = 'Success';
                userData.user = user;
            } else {
                userData.errCode = 2;
                userData.message = 'Invalid password';
                userData.user = null;
            }
        }
        console.log(userData);
        return userData;
    } catch (error) {
        userData.errCode = 3;
        userData.message = 'Internal server error';
        userData.user = null;
    }
};

const handleRegister = async (name, username, email, password) => {
    let userData = {};
    try {
        // Kiểm tra xem người dùng đã tồn tại hay chưa
        const existingUser = await checkUserEmail(email);
        if (existingUser) {
            userData.errCode = 1;
            userData.message = 'email is exitting';
        } else {
            // Băm mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo người dùng mới
            const newUser = new User({
                name,
                username,
                email,
                password: hashedPassword,
            });
            await newUser.save();

            userData.errCode = 0;
            userData.message = 'successfull';
        }
        return userData;
    } catch (error) {
        throw error;
    }
};

const getUserById = async (userId) => {
    let data = {};
    try {
        const dataUser = await User.findOne({ _id: userId });
        if (dataUser) {
            data.errCode = 0;
            data.dataUser = dataUser;
        } else {
            data.errCode = 1;
            data.message = 'failed!!!';
        }
    } catch (error) {
        console.log(error);
        data.message = 'not connect to DB';
        data.errCode = 1;
    }

    return data;
};

const getAll = async () => {
    let data = {};
    try {
        const dataUser = await User.find();
        if (dataUser) {
            data.errCode = 0;
            data.dataUser = dataUser;
        } else {
            data.errCode = 1;
            data.message = 'failed!!!';
        }
    } catch (error) {
        console.log(error);
        data.message = 'err:' + error;
        data.errCode = 1;
    }
    return data;
};

module.exports = {
    handleRegister,
    handleLogin,
    getUserById,
    getAll,
};
