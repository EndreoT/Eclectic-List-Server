import { Types, Document, Model } from "mongoose";
export interface IImage extends Document {
    path: string;
    public_id: string;
    caption: string;
    folder: string;
    post: Types.ObjectId;
    src_attribution: string;
}
export declare const Image: Model<IImage>;
