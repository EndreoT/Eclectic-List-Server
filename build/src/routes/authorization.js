"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authController_1 = require("../controllers/authController");
const router = express.Router();
router.post('/validate', authController_1.auth.validateJWT);
router.post('/signup', authController_1.auth.signup);
router.post("/login", authController_1.auth.login);
exports.authRouter = router;
//# sourceMappingURL=authorization.js.map