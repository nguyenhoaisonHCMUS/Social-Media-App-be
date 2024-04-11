const SavedService = require('../services/SavedService');

class SavedControllers {
    async savePost(req, res) {
        try {
            const { userId, postId } = req.body;
            if (!userId || !postId) {
                return res.status(403).json({ message: 'no data from BODY' });
            }

            const data = await SavedService.savePost(userId, postId);
            if (data.errCode === 0) {
                res.status(200).json({ data: data, message: 'success' });
            } else {
                res.status(401).json({ message: data.message });
            }
        } catch (error) {
            res.status(200).json({ message: 'error:' + error });
        }
    }
    async unSavePost(req, res) {
        try {
            const { userId, postId } = req.body;
            console.log(req.body);
            if (!userId || !postId) {
                return res.status(403).json({ message: 'no data from BODY' });
            }

            const data = await SavedService.unSavePost(userId, postId);
            if (data.errCode === 0) {
                res.status(200).json({ data: data, message: 'success' });
            } else {
                res.status(401).json({ message: data.message });
            }
        } catch (error) {
            res.status(200).json({ message: 'error:' + error });
        }
    }
}

module.exports = new SavedControllers();
