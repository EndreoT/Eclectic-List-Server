import * as express from "express";

// import authController = require("../controllers/authController");
import * as postController from "../controllers/postController";
import * as internalMiddleWare from '../middleware/middleware'
const router: express.Router = express.Router();



router.get("/", postController.getAllPosts);

router.get("/:post", postController.getPost);

router.get("/postsByCategory/:category", postController.getPostsByCategory);

router.get("/postsByUser/:user", postController.getPostsByUser);




router.post("/createPost", internalMiddleWare.sanitizePost, postController.createPost);
// router.post("/createPost", authController.authenticateJWT, postController.createPost);

router.put("/edit/:id", internalMiddleWare.sanitizePost, postController.updatePost);
// router.put("/edit/:id", authController.authenticateJWT, postController.updatePost);

router.delete("/delete/:id", postController.deletePost);
// router.delete("/delete/:id", authController.authenticateJWT, postController.deletePost);

export const postRouter = router;
