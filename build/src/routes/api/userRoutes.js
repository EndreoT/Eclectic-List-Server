"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authController_1 = require("../../controllers/authController");
const userController = require("../../controllers/userController");
const router = express.Router();
router.route('/')
    .get(userController.getAllUsers);
router.route('/:userId')
    .get(userController.getUserById);
router.route('/username/:username')
    .get(userController.getUserByUsername);
router.route("/fullUser/:userId")
    .get(authController_1.auth.authorizeUser, userController.getFullUser);
exports.userRouter = router;
//# sourceMappingURL=userRoutes.js.map