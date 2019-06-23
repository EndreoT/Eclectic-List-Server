"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_1 = require("express-validator/filter");
const category_1 = require("../models/category");
const image_1 = require("../models/image");
const post_1 = require("../models/post");
const user_1 = require("../models/user");
const validation = require("../validation/validation");
async function getAllPosts(req, res, next) {
    try {
        const posts = await post_1.Post.find().sort('-createdAt').populate("user", "username").populate("category");
        return res.json(posts);
    }
    catch (error) {
        return res.status(404).json({ message: `No posts exist.` });
        // return next(error);
    }
}
exports.getAllPosts = getAllPosts;
;
async function getPost(req, res, next) {
    try {
        const post = await post_1.Post.findById(req.params.post).populate("user", "username avatar_image").populate("category");
        return res.status(200).json(post);
    }
    catch (error) {
        return res.status(404).json({ message: `Post id '${req.params.post} does not exist.'` });
        // return next(error);
    }
}
exports.getPost = getPost;
;
async function getPostsByUser(req, res, next) {
    try {
        const user = await user_1.User.findOne({ username: req.params.user });
        if (user) {
            const posts = await post_1.Post.find({ user: user._id }).populate("category");
            return res.json(posts);
        }
        return res.status(404).json({ message: `User '${req.params.user}' does not exist.` });
    }
    catch (error) {
        return next(error);
    }
}
exports.getPostsByUser = getPostsByUser;
;
async function getPostsByCategory(req, res, next) {
    try {
        const category = await category_1.Category.findOne({ category: req.params.category });
        if (category) {
            const posts = await post_1.Post.find({ category: category._id }).populate("user", "username");
            return res.json(posts);
        }
        return res.status(404).json({ message: `Category '${req.params.category}' does not exist.` });
    }
    catch (error) {
        return next(error);
    }
}
exports.getPostsByCategory = getPostsByCategory;
exports.createPost = [
    filter_1.sanitizeBody("subject").trim().escape(),
    filter_1.sanitizeBody("description").trim().escape(),
    filter_1.sanitizeBody("price").toFloat().trim().escape(),
    async (req, res, next) => {
        const { error } = validation.validatePost(req.body);
        if (error) {
            return res.status(400).json(error.details[0]);
        }
        try {
            const [user, category] = await Promise.all([user_1.User.findById(req.body.userId), category_1.Category.findOne({ category: req.body.category })]);
            if (!user || !category) {
                return res.json({ message: `User with id ${req.body.userId} does not exist.` });
            }
            const postCreateBody = {
                subject: req.body.subject,
                description: req.body.description,
                price: req.body.price,
                category: category._id,
                user: user._id,
            };
            const post = new post_1.Post(postCreateBody);
            const savedPost = await post.save();
            await Promise.all([
                user_1.User.findByIdAndUpdate(user._id, { $inc: { number_of_posts: 1 } }),
                category_1.Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: 1 } })
            ]);
            return res.json(savedPost);
        }
        catch (error) {
            return next(error);
        }
    }
];
exports.updatePost = [
    // TODO update category count
    filter_1.sanitizeBody("subject").trim().escape(),
    filter_1.sanitizeBody("description").trim().escape(),
    filter_1.sanitizeBody("price").toFloat().trim().escape(),
    async (req, res, next) => {
        const { error } = validation.validatePost(req.body);
        if (error) {
            return res.status(400).json(error.details[0]);
        }
        try {
            const [category, originalPost] = await Promise.all([category_1.Category.findOne({ category: req.body.category }), post_1.Post.findById(req.params.id)]);
            if (!originalPost || !category) {
                return res.json({ message: `Post with id ${req.params.id} does not exist.` });
            }
            if (category._id !== originalPost.category) { //Updates number of posts for category
                await Promise.all([
                    category_1.Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: 1 } }),
                    category_1.Category.findByIdAndUpdate(originalPost.category, { $inc: { number_of_posts: -1 } }),
                ]);
            }
            const postUpdateBody = {
                subject: req.body.subject,
                description: req.body.description,
                price: req.body.price,
                category: category._id,
            };
            const post = await post_1.Post.findByIdAndUpdate(req.params.id, {
                $set: postUpdateBody,
            }, { new: true });
            if (!post) {
                return res.status(404).json({ message: "That post ID was not found." });
            }
            return res.send(post);
        }
        catch (error) {
            return next(error);
        }
    }
];
async function deletePost(req, res, next) {
    try {
        const post = await post_1.Post.findById(req.params.id);
        if (!post) {
            return res.json({ message: `Post with id ${req.params.id} does not exist.` });
        }
        const [user, category] = await Promise.all([user_1.User.findById(post.user), category_1.Category.findById(post.category)]);
        if (!user || !category) {
            return res.json({ message: `User with id ${post.user} does not exist.` });
        }
        // Delete post and update number of posts for user and category
        const [deletedPost] = await Promise.all([
            post_1.Post.findByIdAndDelete(req.params.id),
            user_1.User.findByIdAndUpdate(user._id, { $inc: { number_of_posts: -1 } }),
            category_1.Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: -1 } }),
            image_1.Image.deleteMany({ post: post._id }),
        ]);
        return res.send(deletedPost);
    }
    catch (error) {
        return res.status(404).json({ message: `Post id '${req.params.id} does not exist.'` });
    }
}
exports.deletePost = deletePost;
//# sourceMappingURL=postController.js.map