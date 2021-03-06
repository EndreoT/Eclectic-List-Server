const Category = require("../models/category");

exports.getAllCategories = async function (req, res, next) {
    try {
        const categories = await Category.find().sort({ category: 1 });
        return res.send(categories);
    } catch (error) {
        return next(error);
    };
};

exports.getCategory = async function (req, res, next) {
    try {
        const category = await Category.findOne({ category: req.params.category });
        if (category) return res.send(category);
        return res.status(404).json({ message: `Category '${req.params.category}' does not exist.` })
    } catch (error) {
        return next(error);
    }
};
