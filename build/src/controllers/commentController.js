"use strict";
// import { sanitizeBody } from "express-validator/filter";
// const Comment = require("../models/comment");
// const Post = require("../models/post");
// const User = require("../models/user");
// const validation = require("../validation/validation");
// exports.getAllComments = async (req, res, next) => {
//     try {
//         const comments = await Comment.find().sort({ createdAt: 1 });
//         if (comments) return res.send(comments);
//         return res.status(404).json({ message: `No comments exist.` })
//     } catch (error) {
//         return next(error);
//     }
// };
// // Get comment by id
// exports.getComment = async (req, res, next) => {
//     try {
//         const comment = await Comment.findById(req.params.commentId);
//         return res.json(comment);
//     } catch (error) {
//         return res.status(404).json({ message: `Comment id '${req.params.commentId}' does not exist` })
//         // return next(error); 
//     }
// };
// // Get all comments for post id
// exports.getCommentsForPost = async (req, res, next) => {
//     try {
//         const comments = await Comment
//             .find({ post: req.params.postId }).sort({ createdAt: 1 })
//             .populate({ path: "user", select: "username", populate: { path: "avatar_image" } });
//         return res.send(comments);
//     } catch (error) {
//         if (error.name === "CastError") {
//             return res.status(404).json({ message: `Post '${req.params.postId}' does not exist.` })
//         }
//         return next(error);
//     }
// }
// // Creates comment for a given post and user
// exports.createComment = [ //NEED TO Handle HTML chars
//     sanitizeBody("comments").trim().escape(),
//     async function (req, res, next) {
//         const { error } = validation.validateComment(req.body);
//         if (error) {
//             return res.status(400).json(error.details[0]);
//         }
//         try {
//             const [user, post] = await Promise.all([User.findById(req.body.userId), Post.findById(req.body.postId)]);
//             const comment = new Comment(
//                 {
//                     comment: req.body.comment,
//                     post: post._id,
//                     user: user._id,
//                 }
//             );
//             const savedComment = await comment.save();
//             // Update number of comments for post and return new comment
//             const [populatedComment] = await Promise.all(
//                 [
//                     Comment.findById(savedComment._id).populate({ path: "user", select: "username", populate: { path: "avatar_image" } }),
//                     Post.findByIdAndUpdate(post._id, { $inc: { number_of_comments: 1 } }, { new: true })
//                 ]
//             );
//             return res.json(populatedComment);
//         } catch (error) {
//             return next(error);
//         }
//     }
// ];
//# sourceMappingURL=commentController.js.map