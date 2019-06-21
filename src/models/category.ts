import * as mongoose from "mongoose";

import {allowedCategories} from "../constants/categoriesConstants";

export interface ICategory extends mongoose.Document {
    category: string;
    number_of_posts: number;
}

const categorySchema: mongoose.Schema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            validate: {
                validator (category: string) {
                    return allowedCategories.has(category);
                },
                // message: "Category must be permissable category.",
            },
        },
        number_of_posts: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

export const Category: mongoose.Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema);