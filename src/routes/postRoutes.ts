import * as express from "express";

import { auth } from "../controllers/authController";
import * as postController from "../controllers/postController";
import * as internalMiddleWare from '../middleware/middleware';


const router: express.Router = express.Router();


router.get("/", postController.getAllPosts);

router.get("/:post", postController.getPost);

router.get("/postsByCategory/:category", postController.getPostsByCategory);

router.get("/postsByUser/:user", postController.getPostsByUser);

router.post("/createPost", auth.authorizeUser, internalMiddleWare.sanitizePost, postController.createPost);

router.put("/edit/:id", auth.authorizeUser, internalMiddleWare.sanitizePost, postController.updatePost);

router.delete("/delete/:id", auth.authorizeUser, postController.deletePost);

export const postRouter = router;
