"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authController_1 = require("../../controllers/authController");
const postController = require("../../controllers/postController");
const internalMiddleWare = require("../../middleware/middleware");
const router = express.Router();
router.get("/", postController.getAllPosts);
router.get("/:post", postController.getPost);
router.get("/postsByCategory/:category", postController.getPostsByCategory);
router.get("/postsByUser/:user", postController.getPostsByUser);
router.post("/createPost", internalMiddleWare.sanitizePost, authController_1.auth.authorizeUser, postController.createPost);
router.put("/edit/:id", internalMiddleWare.sanitizePost, authController_1.auth.authorizeUser, postController.updatePost);
router.delete("/delete/:id", authController_1.auth.authorizeUser, postController.deletePost);
exports.postRouter = router;
//# sourceMappingURL=postRoutes.js.map