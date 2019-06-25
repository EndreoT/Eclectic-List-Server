import {Schema, Document, Model, model} from 'mongoose';

import {allowedCategories} from "../constants/categoriesConstants";


export interface ICategory extends Document {
    category: string;
    number_of_posts: number;
}

const categorySchema: Schema = new Schema(
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

export const Category: Model<ICategory> = model<ICategory>("Category", categorySchema);