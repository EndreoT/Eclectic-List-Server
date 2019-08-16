"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authController_1 = require("../../controllers/authController");
const postController = require("../../controllers/postController");
const internalMiddleWare = require("../../middleware/middleware");
const router = express.Router();
router.route('/')
    .get(postController.getAllPosts)
    .post(internalMiddleWare.sanitizePost, authController_1.auth.authorizeUser, postController.createPost);
router.route('/:postId')
    .get(postController.getPostById)
    .put(internalMiddleWare.sanitizePost, authController_1.auth.authorizeUser, postController.updatePost)
    .delete(authController_1.auth.authorizeUser, postController.deletePost);
router.get("/postsByCategory/:category", postController.getPostsByCategory);
router.get("/postsByUser/:user", postController.getPostsByUser);
exports.postRouter = router;
//# sourceMappingURL=postRoutes.js.map