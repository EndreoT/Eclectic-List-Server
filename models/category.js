const mongoose = require("mongoose");

const categories = require("../constants/categoriesConstants");

const categorySchema = mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return categories.has(v);
                },
                message: "Category must be permissable category."
            }
        },
        number_of_posts: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);