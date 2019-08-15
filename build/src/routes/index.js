"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const auth_1 = require("./auth");
const api_1 = require("./api");
const router = express.Router();
// API Routes
router.use('/api', api_1.apiRouter);
// Auth Routes
router.use('/auth', auth_1.authRouter);
exports.appRouter = router;
//# sourceMappingURL=index.js.map