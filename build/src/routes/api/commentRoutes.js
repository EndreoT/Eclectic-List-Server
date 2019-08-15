"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authController_1 = require("../../controllers/authController");
const commentController = require("../../controllers/commentController");
const internalMiddleware = require("../../middleware/middleware");
const router = express.Router();
router.route('/')
    .get(commentController.getAllComments)
    .post(internalMiddleware.sanitizeComment, authController_1.auth.authorizeUser, commentController.createComment);
router.route('/:commentId')
    .get(commentController.getCommentById);
router.route('/commentsForPost/:postId')
    .get(commentController.getCommentsForPost);
exports.commentRouter = router;
//# sourceMappingURL=commentRoutes.js.map