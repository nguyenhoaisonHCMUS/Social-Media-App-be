const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
var appRoot = require('app-root-path');

const PostController = require('../controllers/PostController');
const UserController = require('../controllers/UserController');

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
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + '/src/uploads');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter });

function route(app) {
    app.get('/', (req, res) => {
        res.send('Home');
    });

    app.get('/users', authenToken, UserController.getAll);

    //USER
    app.post('/api/login', UserController.login);
    app.post('/api/register', UserController.register);
    app.post('/api/refreshtoken', UserController.requestRefreshToken);
    app.post('/api/logout', authenToken, UserController.logout);
    app.get('/api/get-user-id', authenToken, UserController.getUserById);

    //POSTS
    app.get('/api/posts', authenToken, PostController.getAll);
    // app.get('/api/posts-all', PostController.getAllx);
    app.get('/api/post-number-of-user', authenToken, PostController.getOfUser);
    app.post('/api/create-post', authenToken, upload.single('image_post'), PostController.createPost);
    app.post('/api/create-post111', PostController.createPost111);
}

module.exports = route;
