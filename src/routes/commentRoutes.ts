import * as express from "express";

// import * as  authController from "../controllers/authController";
import * as  commentController from "../controllers/commentController";
import * as internalMiddleware from '../middleware/middleware';

const router: express.Router = express.Router();


router.get("/", commentController.getAllComments);

router.get("/:commentId", commentController.getComment);

router.post("/",internalMiddleware.sanitizeComment, commentController.createComment);
// router.post("/", authController.authenticateJWT, commentController.createComment);

router.get("/commentsForPost/:postId", commentController.getCommentsForPost);

export const commentRouter = router;