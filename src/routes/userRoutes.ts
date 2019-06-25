import * as express from "express";

import {auth} from "../controllers/authController";
import * as userController from "../controllers/userController";


const router: express.Router = express.Router();


router.get("/", userController.getAllUsers);

router.get("/:user", userController.getUser);

router.get("/userById/:user", userController.getUserById);

router.get("/fullUser/:userId", auth.authorizeUserParams, userController.getFullUser);

export const userRouter = router;
