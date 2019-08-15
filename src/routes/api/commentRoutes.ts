import * as express from "express";

import { auth } from "../../controllers/authController";
import * as  commentController from "../../controllers/commentController";
import * as internalMiddleware from '../../middleware/middleware';


const router: express.Router = express.Router();


router.route('/')
  .get(commentController.getAllComments)
  .post(internalMiddleware.sanitizeComment, auth.authorizeUser, commentController.createComment);

router.route('/:commentId')
  .get(commentController.getCommentById);

router.route('/commentsForPost/:postId')
  .get(commentController.getCommentsForPost);

export const commentRouter = router;