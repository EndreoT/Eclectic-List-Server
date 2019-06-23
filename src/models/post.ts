import * as moment from "moment";
import { Types, Schema, Document, Model, model } from "mongoose";

import { postModelConstants } from "../constants/postConstants";


export interface IPost extends Document {
  subject: string;
  description: string;
  price: number;
  category: Types.ObjectId;
  user: Types.ObjectId;
  number_of_comments: number;
  createdAt: Date;
}

const postSchema: Schema = new Schema(
  {
    subject: {
      type: String,
      required: true,
      minLength: postModelConstants.subjectMin,
      maxlength: postModelConstants.subjectMax,
    },
    // TODO add location
    // location: {
    //     type: String,
    // },
    description: {
      type: String,
      required: true,
      minlength: postModelConstants.descriptionMin,
      maxlength: postModelConstants.descriptionMax,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    number_of_comments: {
      type: Number,
      default: 0,
    },
    // images: [{ // <- Image model stores ref to post instead
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Image',
    //     required: false,
    // }],
  },
  { timestamps: true }
);

postSchema.set("toJSON", { virtuals: true });

postSchema
  .virtual("dateCreatedFormatted")
  .get(function (this: IPost) {
    return moment(this.createdAt).format("MMMM Do, YYYY, h:mm a");
  });

export const Post: Model<IPost> = model("Post", postSchema);
