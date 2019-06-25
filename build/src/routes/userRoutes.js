"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authController_1 = require("../controllers/authController");
const userController = require("../controllers/userController");
const router = express.Router();
router.get("/", userController.getAllUsers);
router.get("/:user", userController.getUser);
router.get("/userById/:user", userController.getUserById);
router.get("/fullUser/:userId", authController_1.auth.authorizeUserParams, userController.getFullUser);
exports.userRouter = router;
//# sourceMappingURL=userRoutes.js.map