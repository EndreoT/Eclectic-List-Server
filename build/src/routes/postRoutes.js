"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
// import authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const router = express.Router();
router.get("/", postController.getAllPosts);
// router.get("/:post", postController.getPost);
// router.get("/postsByCategory/:category", postController.getPostsByCategory);
// router.get("/postsByUser/:user", postController.getPostsByUser);
// router.post("/createPost", authController.authenticateJWT, postController.createPost);
// router.put("/edit/:id", authController.authenticateJWT, postController.updatePost);
// router.delete("/delete/:id", authController.authenticateJWT, postController.deletePost);
exports.postRouter = router;
//# sourceMappingURL=postRoutes.js.map