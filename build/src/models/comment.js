"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const mongoose_1 = require("mongoose");
const postConstants_1 = require("../constants/postConstants");
const commentSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        required: true,
        minLength: postConstants_1.postModelConstants.subjectMin,
        maxlength: postConstants_1.postModelConstants.subjectMax,
    },
    post: {
        type: mongoose_1.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
commentSchema.set("toJSON", { virtuals: true });
commentSchema
    .virtual("dateCreatedFormatted")
    .get(function () {
    return moment(this.createdAt).format("MMMM Do, YYYY, h:mm a");
});
exports.Comment = mongoose_1.model("Comment", commentSchema);
//# sourceMappingURL=comment.js.map