"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = require("../models/category");
async function getAllCategories(req, res, next) {
    try {
        const categories = await category_1.Category.find().sort({ category: 1 });
        return res.send(categories);
    }
    catch (error) {
        return next(error);
    }
}
exports.getAllCategories = getAllCategories;
async function getCategory(req, res, next) {
    try {
        const categoryParam = req.params.categoryId;
        const category = await category_1.Category.findOne({ category: categoryParam });
        if (category) {
            return res.send(category);
        }
        return res.status(404).json({ message: `Category '${categoryParam}' does not exist.` });
    }
    catch (error) {
        return next(error);
    }
}
exports.getCategory = getCategory;
//# sourceMappingURL=categoryController.js.map