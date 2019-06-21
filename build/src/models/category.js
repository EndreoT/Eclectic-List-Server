"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const categoriesConstants_1 = require("../constants/categoriesConstants");
const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        validate: {
            validator(category) {
                return categoriesConstants_1.allowedCategories.has(category);
            },
        },
    },
    number_of_posts: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.Category = mongoose.model("Category", categorySchema);
//# sourceMappingURL=category.js.map