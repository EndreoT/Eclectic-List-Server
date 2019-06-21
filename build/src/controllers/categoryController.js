"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const Category = require("../models/category");
async function getAllCategories(req, res, next) {
    try {
        // const categories = await Category.find().sort({ category: 1 });
        // return res.send(categories);
        return res.json('hello');
    }
    catch (error) {
        return next(error);
    }
}
exports.getAllCategories = getAllCategories;
// exports.getCategory = async function (req, res, next) {
//     try {
//         const category = await Category.findOne({ category: req.params.category });
//         if (category) return res.send(category);
//         return res.status(404).json({ message: `Category '${req.params.category}' does not exist.` })
//     } catch (error) {
//         return next(error);
//     }
// };
//# sourceMappingURL=categoryController.js.map