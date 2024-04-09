const User = require('../models/UserModel');
const UserService = require('../services/UserService');
const jwt = require('jsonwebtoken');

let refreshTokens = [];

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_ACCESS_PRIVATE_KEY, { expiresIn: '30d' });
};
const generateRefreshAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_REFRESH_PRIVATE_KEY, { expiresIn: '30d' });
};

class UserController {
    async getAll(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async login(req, res) {
        try {
            let email = req.body.email;
            let password = req.body.password;

            if (!email || !password) {
                return res.status(400).json({ err: 'no data input' });
            }

            const userData = await UserService.handleLogin(email, password);
            if (userData.errCode === 0) {
                // Tạo mã thông báo truy cập và mã thông báo làm mới
                const accessToken = generateAccessToken({ userID: userData.user._id });
                const refreshToken = generateRefreshAccessToken({
                    user: { username: userData.user.username, email: userData.user.email },
                });

                // Lưu mã thông báo làm mới vào danh sách refreshTokens và gửi nó về cho client thông qua cookie
                refreshTokens.push(refreshToken);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });

                return res.status(200).json({ user: userData.user, accessToken: accessToken });
            } else {
                return res.status(401).json({ message: userData.message });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async register(req, res) {
        try {
            let { email, password, username, name } = req.body;
            if (!email || !password || !username || !name) {
                return res.status(400).json({ err: 'no data' });
            }

            const userData = await UserService.handleRegister(name, username, email, password);
            res.status(200).json({ userData, mes: 'successfull' });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async requestRefreshToken(req, res) {
        try {
            const refreshtoken = req.cookies.refreshToken;
            console.log(refreshtoken);
            if (!refreshtoken) {
                return res.status(401).json({ message: "You're not authenticated!" });
            }

            if (!refreshTokens.includes(refreshtoken)) {
                return res.status(403).json('refreshToken is not valid');
            }

            jwt.verify(refreshtoken, process.env.JWT_REFRESH_PRIVATE_KEY, (err, data) => {
                if (err) {
                    return res.status(401).json({ err });
                }
                console.log(data);

                // Xác thực thành công, cập nhật mã thông báo
                const newAccessToken = generateAccessToken({ data: data || 'not data' });
                const newRefreshToken = generateRefreshAccessToken({ data: data || 'not data' });

                // Xóa mã thông báo cũ
                refreshTokens = refreshTokens.filter((token) => token !== refreshtoken);

                // Thêm mã thông báo mới vào danh sách
                refreshTokens.push(newRefreshToken);

                // Gửi lại mã thông báo truy cập mới và cập nhật mã thông báo làm mới trong cookie
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                return res.status(200).json({ accessToken: newAccessToken });
            });
        } catch (error) {
            console.error('Error refreshing token:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async logout(req, res) {
        try {
            await res.clearCookie('refreshToken');
            refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
            res.status(200).json({ message: 'logout successfull' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getUserById(req, res) {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(403).json({ message: 'no data query' });
            }
            const data = await UserService.getUserById(userId);
            if (data.errCode === 0) {
                return res.status(200).json({ message: 'success', data: data.dataUser });
            }

            return res.status(401).json({ message: data.message });
        } catch (error) {
            return res.status(500).json({ message: 'server not found' });
        }
    }
}

module.exports = new UserController();