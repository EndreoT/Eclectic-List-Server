"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categoriesConstants_1 = require("../constants/categoriesConstants");
const categorySchema = new mongoose_1.Schema({
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
exports.Category = mongoose_1.model("Category", categorySchema);
//# sourceMappingURL=category.js.map