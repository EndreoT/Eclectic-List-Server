import * as mongoose from "mongoose";
export interface ICategory extends mongoose.Document {
    category: string;
    number_of_posts: number;
}
export declare const Category: mongoose.Model<ICategory>;
