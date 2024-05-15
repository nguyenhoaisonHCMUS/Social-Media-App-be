const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    const token = jwt.sign(user, process.env.JWT_ACCESS_PRIVATE_KEY, { expiresIn: '2h' });
    return token;
};
const generateRefreshAccessToken = (user, res) => {
    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_PRIVATE_KEY, { expiresIn: '30d' });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
    });

    return refreshToken;
};

//authentication
function authenToken(req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
        return res.status(401).json({ message: 'no token auh' });
    }
    const token = authorizationHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'no token' });
    }
    jwt.verify(token, process.env.JWT_ACCESS_PRIVATE_KEY, (err, data) => {
        if (err) {
            return res.status(403).json({ message: 'invalid token' }); // Trả về 403 nếu token không hợp lệ
        }
        // console.log(data);
        req.user = data;
        next();
    });
}

module.exports = { generateAccessToken, generateRefreshAccessToken, authenToken };
