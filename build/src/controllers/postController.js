"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = require("../models/category");
const image_1 = require("../models/image");
const post_1 = require("../models/post");
const user_1 = require("../models/user");
const validation = require("../validation/validation");
// interface IPostBody {
//   subject: string;
//   description: string;
//   price: number;
//   category: string;
//   userId?: string;
//   user?: string;
// }
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
async function getPostById(req, res, next) {
    try {
        const post = await post_1.Post.findById(req.params.postId).populate("user", "username avatar_image").populate("category");
        return res.status(200).json(post);
    }
    catch (error) {
        return res.status(404).json({ message: `Post id '${req.params.post} does not exist.'` });
        // return next(error);
    }
}
exports.getPostById = getPostById;
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
//NEED TO Handle HTML chars
async function createPost(req, res, next) {
    const { error } = validation.validatePost(req.body);
    if (error) {
        return res.status(400).json(error.details[0]);
    }
    try {
        const category = await category_1.Category.findOne({ category: req.body.category });
        if (!category) {
            return res.json({ message: 'Category does not exist.' });
        }
        const authenticatedUser = res.locals.authenticatedUser;
        const postCreateBody = {
            subject: req.body.subject,
            description: req.body.description,
            price: req.body.price,
            category: category._id,
            user: authenticatedUser._id,
        };
        const post = new post_1.Post(postCreateBody);
        const savedPost = await post.save();
        await Promise.all([
            user_1.User.findByIdAndUpdate(authenticatedUser._id, { $inc: { number_of_posts: 1 } }),
            category_1.Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: 1 } }),
        ]);
        return res.json(savedPost);
    }
    catch (error) {
        return next(error);
    }
}
exports.createPost = createPost;
async function updatePost(req, res, next) {
    const { error } = validation.validatePost(req.body);
    if (error) {
        return res.status(400).json(error.details[0]);
    }
    try {
        const postId = req.params.postId;
        const [category, originalPost] = await Promise.all([category_1.Category.findOne({ category: req.body.category }), post_1.Post.findById(postId)]);
        if (!originalPost) {
            return res.json({ message: `Post with id ${postId} does not exist.` });
        }
        if (!category) {
            return res.json({ message: 'Category does not exist.' });
        }
        const authenticatedUser = res.locals.authenticatedUser;
        if (authenticatedUser._id.toString() !== originalPost.user.toString()) {
            return res.status(422).json({ message: 'You are not authorized to perform this action' });
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
            user: authenticatedUser._id.toString(),
        };
        const post = await post_1.Post.findByIdAndUpdate(postId, {
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
exports.updatePost = updatePost;
async function deletePost(req, res, next) {
    try {
        const postId = req.params.postId;
        const post = await post_1.Post.findById(postId);
        if (!post) {
            return res.json({ message: `Post with id ${postId} does not exist.` });
        }
        const authenticatedUser = res.locals.authenticatedUser;
        if (authenticatedUser._id.toString() !== post.user.toString()) {
            return res.status(422).json({ message: 'You are not authorized to perform this action' });
        }
        const category = await category_1.Category.findById(post.category);
        if (!category) {
            return res.status(404).json({ message: 'Category does not exist' });
        }
        // Delete post and update number of posts for user and category
        const [deletedPost] = await Promise.all([
            post_1.Post.findByIdAndDelete(postId),
            user_1.User.findByIdAndUpdate(authenticatedUser._id, { $inc: { number_of_posts: -1 } }),
            category_1.Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: -1 } }),
            image_1.Image.deleteMany({ post: post._id }),
        ]);
        return res.send(deletedPost);
    }
    catch (error) {
        return res.status(404).json({ message: `Post id '${req.params.postId} does not exist.'` });
    }
}
exports.deletePost = deletePost;
//# sourceMappingURL=postController.js.map