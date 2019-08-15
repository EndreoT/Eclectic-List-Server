"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const categoryController = require("../../controllers/categoryController");
const router = express.Router();
router.route('/')
    .get(categoryController.getAllCategories);
router.route('/:categoryId')
    .get(categoryController.getCategory);
exports.categoryRouter = router;
//# sourceMappingURL=categoryRoutes.js.map