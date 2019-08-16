import * as express from "express";

import { auth } from "../../controllers/authController";
import * as userController from "../../controllers/userController";


const router: express.Router = express.Router();


router.route('/')
  .get(userController.getAllUsers);

router.route('/:userId')
  .get(userController.getUserById);

router.route('/username/:username')
  .get(userController.getUserByUsername);

router.route("/fullUser/:userId")
  .get(auth.authorizeUser, userController.getFullUser);

export const userRouter = router;
