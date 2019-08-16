"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const userRoutes_1 = require("./userRoutes");
const categoryRoutes_1 = require("./categoryRoutes");
const imageRoutes_1 = require("./imageRoutes");
const postRoutes_1 = require("./postRoutes");
const commentRoutes_1 = require("./commentRoutes");
const router = express.Router();
// // User routes
router.use('/users', userRoutes_1.userRouter);
// Category routes
router.use('/category', categoryRoutes_1.categoryRouter);
// Post routes
router.use('/posts', postRoutes_1.postRouter);
// Comment routes
router.use('/comments', commentRoutes_1.commentRouter);
// Image routes
router.use('/images', imageRoutes_1.imageRouter);
exports.apiRouter = router;
//# sourceMappingURL=index.js.map