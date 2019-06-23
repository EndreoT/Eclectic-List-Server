import { Document, Model } from 'mongoose';
export interface ICategory extends Document {
    category: string;
    number_of_posts: number;
}
export declare const Category: Model<ICategory>;
