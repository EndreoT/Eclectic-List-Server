import * as express from "express";

import { auth } from "../controllers/authController";
import * as postController from "../controllers/postController";
import * as internalMiddleWare from '../middleware/middleware';


const router: express.Router = express.Router();


router.get("/", postController.getAllPosts);

router.get("/:post", postController.getPost);

router.get("/postsByCategory/:category", postController.getPostsByCategory);

router.get("/postsByUser/:user", postController.getPostsByUser);

router.post("/createPost", internalMiddleWare.sanitizePost, auth.authorizeUser, postController.createPost);

router.put("/edit/:id", internalMiddleWare.sanitizePost, auth.authorizeUser, postController.updatePost);

router.delete("/delete/:id", auth.authorizeUser, postController.deletePost);

export const postRouter = router;
