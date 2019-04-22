const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();


router.get("/", userController.getAllUsers);

router.get("/:user", userController.getUser);

router.get("/userById/:user", userController.getUserById);

router.get("/fullUser/:userId", authController.authenticateJWT, userController.getFullUser);

module.exports = router;
