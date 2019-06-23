import * as express from "express";

// import authController = require("../controllers/authController");
import * as postController from "../controllers/postController";

const router: express.Router = express.Router();


router.get("/", postController.getAllPosts);

// router.get("/:post", postController.getPost);

// router.get("/postsByCategory/:category", postController.getPostsByCategory);

// router.get("/postsByUser/:user", postController.getPostsByUser);

// router.post("/createPost", authController.authenticateJWT, postController.createPost);

// router.put("/edit/:id", authController.authenticateJWT, postController.updatePost);

// router.delete("/delete/:id", authController.authenticateJWT, postController.deletePost);

export const postRouter = router;
