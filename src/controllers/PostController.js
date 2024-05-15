const PostService = require('../services/PostService');
const Post = require('../models/PostModel');
const mongoose = require('mongoose');
const port = 5000;

class PostController {
    async getAll(req, res) {
        try {
            const data = await PostService.getAll();
            if (data.errCode === 0) {
                return res.status(200).json({ data: data.posts });
            } else {
                return res.status(401), json({ message: data.message });
            }
        } catch (error) {
            return res.status(500).json({ message: 'server not found' });
        }
    }
    async createPost(req, res) {
        const { caption, tags, location, creator } = req.body;
        const imgUrl = `http://localhost:${port}/uploads/` + req.file.filename;
        const postData = {
            caption,
            tags,
            imgUrl,
            location,
            creator,
        };
        try {
            if (req.fileValidationError) {
                return res.status(401).json({ message: req.fileValidationError });
            } else if (!req.file) {
                return res.status(401).json({ message: 'Please select an image to upload' });
            } else {
                //return res.status(200).json({ message: 'successfull' });

                const newPost = await PostService.createPost(postData);
                res.status(201).json(newPost);
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // async createPost111(req, res) {
    //     // console.log(req.headers);
    //     const { caption, tags, imgUrl, location, creator } = req.body;

    //     const postData = {
    //         caption,
    //         tags,
    //         imgUrl,
    //         location,
    //         creator,
    //     };

    //     try {
    //         const newPost = await PostService.createPost111(postData);
    //         res.status(201).json(newPost);
    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }
    // }

    async getOfUser(req, res) {
        try {
            const creator = req.query.creator;

            if (!creator) {
                return res.status(403).json({ message: 'no data on body' });
            }
            const data = await PostService.getOfUser(creator);
            if (data.errCode === 0) {
                return res.status(200).json({ message: 'success', data: data.posts });
            }

            return res.status(401).json({ message: 'nodata' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'server not found' });
        }
    }

    async getOfCaption(req, res) {
        const caption = req.query.caption;

        if (!caption) {
            return res.status(403).json({ message: 'nodata from BODY' });
        }
        try {
            const data = await PostService.getOfCaption(caption);
            if (data.errCode === 0) {
                return res.status(200).json({ data: data.data });
            } else {
                return res.status(401).json({ message: data.message });
            }
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    }
    async getOfID(req, res) {
        try {
            const postId = req.query.postId;

            if (!postId) {
                return res.status(403).json({ message: 'no data on body' });
            }
            const data = await PostService.getOfID(postId);
            if (data.errCode === 0) {
                return res.status(200).json({ message: 'success', data: data.data });
            }

            return res.status(401).json({ message: 'nodata' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'server not found' });
        }
    }

    async updatePost(req, res) {
        const _id = req.params._id;
        console.log('params: ', req.params);
        const { name, email, imgUrl, password, username } = req.body;
        if (!_id) {
            return res.status(403).json({ message: 'PostId not found' });
        }
        try {
            const updatedFields = { caption, tags, imgUrl, location }; // Only update fields provided in the request body

            const updatedUser = await Post.findByIdAndUpdate(_id, updatedFields, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error updating post:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new PostController();
