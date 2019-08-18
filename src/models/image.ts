import { Types, Schema, Document, Model, model } from "mongoose";


const folders: Set<string> = new Set(['avatar', 'postImage']);

export interface IImage extends Document {
  path: string;
  public_id: string;
  caption: string;
  folder: string;
  post: Types.ObjectId;
  src_attribution: string;
}

const imageSchema: Schema = new Schema(
    {
        path: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            required: false,
        },
        folder: {
            type: String,
            required: true,
            validate: {
                validator (v: string) {
                    return folders.has(v);
                },
            },
        },
        post: {
            type: Types.ObjectId,
            required: false,
            ref: 'Post',
        },
        src_attribution: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

export const Image: Model<IImage> = model('Image', imageSchema);