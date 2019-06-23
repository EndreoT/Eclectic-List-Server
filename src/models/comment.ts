import * as moment from "moment";
import { Types, Schema, Document, Model, model } from "mongoose";

import { postModelConstants } from "../constants/postConstants";


export interface IComment extends Document {
  comment: string;
  post: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
}

const commentSchema: Schema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      minLength: postModelConstants.subjectMin,
      maxlength: postModelConstants.subjectMax,
    },
    post: {
      type: Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

commentSchema.set("toJSON", { virtuals: true });

commentSchema
  .virtual("dateCreatedFormatted")
  .get(function (this: IComment) {
    return moment(this.createdAt).format("MMMM Do, YYYY, h:mm a");
  });

export const Comment: Model<IComment> = model("Comment", commentSchema);
