import * as express from "express";

import {auth} from "../controllers/authController";
import * as userController from "../controllers/userController";


const router: express.Router = express.Router();


router.get("/", userController.getAllUsers);

router.get("/:user", userController.getUserByUsername);

router.get("/userById/:userId", userController.getUserById);

router.get("/fullUser/:userId", auth.authorizeUser, userController.getFullUser);

export const userRouter = router;
