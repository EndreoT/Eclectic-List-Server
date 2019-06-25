"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authController_1 = require("../controllers/authController");
const commentController = require("../controllers/commentController");
const internalMiddleware = require("../middleware/middleware");
const router = express.Router();
router.get("/", commentController.getAllComments);
router.get("/:commentId", commentController.getComment);
router.post("/", internalMiddleware.sanitizeComment, authController_1.auth.authorizeUserBody, commentController.createComment);
router.get("/commentsForPost/:postId", commentController.getCommentsForPost);
exports.commentRouter = router;
//# sourceMappingURL=commentRoutes.js.map