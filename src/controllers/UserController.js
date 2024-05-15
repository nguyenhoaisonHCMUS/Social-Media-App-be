const User = require('../models/UserModel');
const UserService = require('../services/UserService');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshAccessToken } = require('../utils/index');

let refreshTokens = [];

class UserController {
    async getAll(req, res) {
        try {
            const users = await UserService.getAll();
            return res.status(200).json({ message: 'success', data: users });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Server error' });
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
                // create new access and refresh Token
                const accessToken = generateAccessToken({ userID: userData.user._id });
                const refreshToken = generateRefreshAccessToken(
                    {
                        username: userData.user.username,
                    },
                    res,
                );

                refreshTokens.push(refreshToken);

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
        console.log(req.cookies);
        try {
            const refreshtoken = req.cookies.refreshToken;
            console.log('refreshtoken: ', refreshtoken);
            if (!refreshtoken) {
                return res.status(401).json({ message: "You're not authenticated!" });
            }

            if (!refreshTokens.includes(refreshtoken)) {
                return res.status(401).json({ message: 'refreshToken is not valid' });
            }

            jwt.verify(refreshtoken, process.env.JWT_REFRESH_PRIVATE_KEY, (err, data) => {
                if (err) {
                    return res.status(401).json({ err });
                }
                console.log('data verify: ', data);

                // Xác thực thành công, cập nhật mã thông báo
                const newAccessToken = generateAccessToken({ data: data || 'not data' });
                const newRefreshToken = generateRefreshAccessToken({ data: data || 'not data' }, res);

                // Xóa mã thông báo cũ
                refreshTokens = refreshTokens.filter((token) => token !== refreshtoken);

                // Thêm mã thông báo mới vào danh sách
                refreshTokens.push(newRefreshToken);

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

    async updateUser(req, res) {
        const _id = req.params._id;
        console.log('params: ', req.params, _id);
        const { name, email, imgUrl, password, username } = req.body;
        if (!_id) {
            return res.status(403).json({ message: 'UserId not found' });
        }
        try {
            const updatedFields = { name, email, imgUrl, password, username }; // Only update fields provided in the request body

            const updatedUser = await User.findByIdAndUpdate(_id, updatedFields, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new UserController();
