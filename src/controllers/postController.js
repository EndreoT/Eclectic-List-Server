// const { sanitizeBody } = require("express-validator/filter");

// const Category = require("../models/category");
// const Image = require('../models/image');
// const Post = require("../models/post");
// const User = require("../models/user");
// const validation = require("../validation/validation");

// exports.getAllPosts = async function (req, res, next) {
//     try {
//         const posts = await Post.find().sort('-createdAt').populate("user", "username").populate("category");
//         return res.json(posts);
//     } catch (error) {
//         return res.status(404).json({ message: `No posts exist.` });
//         // return next(error);
//     }
// };

// exports.getPost = async function (req, res, next) {
//     try {
//         const post = await Post.findById(req.params.post).populate("user", "username avatar_image").populate("category");
//         return res.status(200).json(post);
//     } catch (error) {
//         return res.status(404).json({ message: `Post id '${req.params.post} does not exist.'` });
//         // return next(error);
//     }
// };

// exports.getPostsByUser = async function (req, res, next) {
//     try {
//         const user = await User.findOne({ username: req.params.user });
//         if (user) {
//             const posts = await Post.find({ user: user._id }).populate("category");
//             return res.json(posts);
//         }
//         return res.status(404).json({ message: `User '${req.params.user}' does not exist.` });
//     } catch (error) {
//         return next(error);
//     }
// };

// exports.getPostsByCategory = async function (req, res, next) {
//     try {
//         const category = await Category.findOne({ category: req.params.category });
//         if (category) {
//             const posts = await Post.find({ category: category._id }).populate("user", "username");
//             return res.json(posts);
//         }
//         return res.status(404).json({ message: `Category '${req.params.category}' does not exist.` });
//     } catch (error) {
//         return next(error);
//     }
// };

// exports.createPost = [ //NEED TO Handle HTML chars
//     sanitizeBody("subject").trim().escape(),
//     sanitizeBody("description").trim().escape(),
//     sanitizeBody("price").toFloat().trim().escape(),

//     async function (req, res, next) {
//         const { error } = validation.validatePost(req.body);
//         if (error) {
//             return res.status(400).json(error.details[0]);
//         }
//         try {
//             const [user, category] = await Promise.all(
//                 [User.findById(req.body.userId), Category.findOne({ category: req.body.category })]
//             );
//             const post = new Post({
//                 subject: req.body.subject,
//                 description: req.body.description,
//                 price: req.body.price,
//                 category: category._id,
//                 user: user._id,
//             });
//             const savedPost = await post.save();
//             await Promise.all(
//                 [
//                     User.findByIdAndUpdate(user._id, { $inc: { number_of_posts: 1 } }),
//                     Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: 1 } })
//                 ]
//             );
//             return res.json(savedPost);
//         } catch (error) {
//             return next(error);
//         }
//     }
// ];

// exports.updatePost = [
//     // TODO update category count
//     sanitizeBody("subject").trim().escape(),
//     sanitizeBody("description").trim().escape(),
//     sanitizeBody("price").toFloat().trim().escape(),

//     async function (req, res, next) {
//         const { error } = validation.validatePost(req.body);
//         if (error) {
//             return res.status(400).json(error.details[0]);
//         }
//         try {
//             const [category, originalPost] = await Promise.all([Category.findOne({ category: req.body.category }), Post.findById(req.params.id)]);
//             if (category._id !== originalPost.category) { //Updates number of posts for category
//                 await Promise.all([
//                     Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: 1 } }),
//                     Category.findByIdAndUpdate(originalPost.category, { $inc: { number_of_posts: -1 } })
//                 ]);
//             }
//             const post = await Post.findByIdAndUpdate(req.params.id,
//                 {
//                     $set: {
//                         subject: req.body.subject,
//                         description: req.body.description,
//                         price: req.body.price,
//                         category: category._id,
//                     }
//                 },
//                 { new: true }
//             );

//             if (!post) {
//                 return res.status(404).json({ message: "That post ID was not found." });
//             }
//             return res.send(post);
//         } catch (error) {
//             return next(error);
//         }
//     }];

// exports.deletePost = async function (req, res, next) {
//     try {
//         const post = await Post.findById(req.params.id);
//         const [user, category] = await Promise.all(
//             [User.findById(post.user), Category.findById(post.category)]
//         )
//         // Delete post and update number of posts for user and category
//         const [deletedPost] = await Promise.all(
//             [
//                 Post.findByIdAndDelete(req.params.id),
//                 User.findByIdAndUpdate(user._id, { $inc: { number_of_posts: -1 } }),
//                 Category.findByIdAndUpdate(category._id, { $inc: { number_of_posts: -1 } }),
//                 Image.deleteMany({ post: post._id })
//             ]
//         );
//         return res.send(deletedPost);
//     } catch (error) {
//         return res.status(404).json({ message: `Post id '${req.params.id} does not exist.'` });
//     }
// };
