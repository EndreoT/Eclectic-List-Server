"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_1 = require("../models/comment");
const post_1 = require("../models/post");
const user_1 = require("../models/user");
const validation = require("../validation/validation");
async function getAllComments(req, res, next) {
    try {
        const comments = await comment_1.Comment.find().sort({ createdAt: 1 });
        if (comments)
            return res.send(comments);
        return res.status(404).json({ message: `No comments exist.` });
    }
    catch (error) {
        return next(error);
    }
}
exports.getAllComments = getAllComments;
// Get comment by id
async function getComment(req, res, next) {
    try {
        const comment = await comment_1.Comment.findById(req.params.commentId);
        return res.json(comment);
    }
    catch (error) {
        return res.status(404).json({ message: `Comment id '${req.params.commentId}' does not exist` });
        // return next(error); 
    }
}
exports.getComment = getComment;
;
// Get all comments for post id
async function getCommentsForPost(req, res, next) {
    try {
        const comments = await comment_1.Comment
            .find({ post: req.params.postId }).sort({ createdAt: 1 })
            .populate({ path: "user", select: "username", populate: { path: "avatar_image" } });
        return res.send(comments);
    }
    catch (error) {
        if (error.name === "CastError") {
            return res.status(404).json({ message: `Post '${req.params.postId}' does not exist.` });
        }
        return next(error);
    }
}
exports.getCommentsForPost = getCommentsForPost;
// Creates comment for a given post and user
// TODO: NEED TO Handle HTML chars
async function createComment(req, res, next) {
    const authenticatedUser = res.locals.authenticatedUser;
    if (authenticatedUser._id.toString() !== req.body.userId) {
        return res.status(422).json({ message: 'You are not authorized to perform this action' });
    }
    const { error } = validation.validateComment(req.body);
    if (error) {
        return res.status(400).json(error.details[0]);
    }
    try {
        const [user, post] = await Promise.all([user_1.User.findById(req.body.userId), post_1.Post.findById(req.body.postId)]);
        if (!user || !post) {
            return res.json({ message: `User with id ${req.body.userId} or Post with id ${req.body.postId} does not exist.` });
        }
        const comment = new comment_1.Comment({
            comment: req.body.comment,
            post: post._id,
            user: user._id,
        });
        const savedComment = await comment.save();
        // Update number of comments for post and return new comment
        const [populatedComment] = await Promise.all([
            comment_1.Comment.findById(savedComment._id).populate({ path: "user", select: "username", populate: { path: "avatar_image" } }),
            post_1.Post.findByIdAndUpdate(post._id, { $inc: { number_of_comments: 1 } }, { new: true }),
        ]);
        return res.json(populatedComment);
    }
    catch (error) {
        return next(error);
    }
}
exports.createComment = createComment;
//# sourceMappingURL=commentController.js.map