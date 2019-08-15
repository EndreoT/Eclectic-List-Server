import * as express from "express";

import { auth } from "../../controllers/authController";
import * as postController from "../../controllers/postController";
import * as internalMiddleWare from '../../middleware/middleware';


const router: express.Router = express.Router();


router.route('/')
  .get(postController.getAllPosts)
  .post(internalMiddleWare.sanitizePost, auth.authorizeUser, postController.createPost);

router.route('/:postId')
  .get(postController.getPostById)
  .put(internalMiddleWare.sanitizePost, auth.authorizeUser, postController.updatePost)
  .delete(auth.authorizeUser, postController.deletePost);

router.get("/postsByCategory/:category", postController.getPostsByCategory);

router.get("/postsByUser/:user", postController.getPostsByUser);




export const postRouter = router;
