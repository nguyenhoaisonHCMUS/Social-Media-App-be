const LikedService = require('../services/LikedService');

class LikedControllers {
    async likePost(req, res) {
        try {
            const { userId, postId } = req.body;
            if (!userId || !postId) {
                return res.status(403).json({ message: 'no data from BODY' });
            }

            const data = await LikedService.likePost(userId, postId);
            if (data.errCode === 0) {
                res.status(200).json({ data: data.data, message: 'success' });
            } else {
                res.status(401).json({ message: data.message });
            }
        } catch (error) {
            res.status(200).json({ message: 'error:' + error });
        }
    }
    async unLikePost(req, res) {
        try {
            const { userId, postId } = req.body;
            console.log(req.body);
            if (!userId || !postId) {
                return res.status(403).json({ message: 'no data from BODY' });
            }

            const data = await LikedService.unLikePost(userId, postId);
            if (data.errCode === 0) {
                res.status(200).json({ data: data.data, message: 'success' });
            } else {
                res.status(401).json({ message: data.message });
            }
        } catch (error) {
            res.status(200).json({ message: 'error:' + error });
        }
    }
}

module.exports = new LikedControllers();
