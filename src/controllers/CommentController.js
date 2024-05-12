const CommentService = require('../services/CommentService');

class CommentController {
    async getCommentByPostId(req, res) {
        const postId = req.query.postId;
        if (!postId) {
            return res.status(403).json({ message: 'nodata from query' });
        }
        try {
            const data = await CommentService.getCommentByPostId(postId);
            if (data.errCode === 0) {
                return res.status(200).json({ data: data.data, message: 'success' });
            }
            return res.status(403).json({ message: data.message });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    async addComment(req, res) {
        const { userId, postId, content, parrent } = req.body;
        if (!userId || !postId || !content) {
            return res.status(401).json({ message: 'nodata from BODY' });
        }
        try {
            const data = {
                userId,
                postId,
                content,
                parrent,
            };
            const resData = await CommentService.addComment(data);
            if (resData.errCode === 0) {
                return res.status(200).json({ message: 'success', data: resData.data });
            }
            return res.status(401).json({ message: 'failed:' + resData.message });
        } catch (error) {
            return res.status(500).json({ message: 'request failed' });
        }
    }
}

module.exports = new CommentController();
