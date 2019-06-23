import { Types, Document, Model } from "mongoose";
export interface IComment extends Document {
    comment: string;
    post: Types.ObjectId;
    user: Types.ObjectId;
    createdAt: Date;
}
export declare const Comment: Model<IComment>;
