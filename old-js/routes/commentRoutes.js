const express = require("express");

const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");

const router = express.Router();


router.get("/", commentController.getAllComments);

router.get("/:commentId", commentController.getComment);

router.post("/", authController.authenticateJWT, commentController.createComment);

router.get("/commentsForPost/:postId", commentController.getCommentsForPost);

module.exports = router;