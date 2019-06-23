import { Types, Document, Model } from "mongoose";
export interface IPost extends Document {
    subject: string;
    description: string;
    price: number;
    category: Types.ObjectId;
    user: Types.ObjectId;
    number_of_comments: number;
    createdAt: Date;
}
export declare const Post: Model<IPost>;
