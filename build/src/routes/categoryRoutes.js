"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const categoryController = require("../controllers/categoryController");
const router = express.Router();
router.get("/", categoryController.getAllCategories);
router.get("/:category", categoryController.getCategory);
exports.categoryRouter = router;
//# sourceMappingURL=categoryRoutes.js.map