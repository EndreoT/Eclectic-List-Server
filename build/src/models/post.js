"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const mongoose_1 = require("mongoose");
const postConstants_1 = require("../constants/postConstants");
const postSchema = new mongoose_1.Schema({
    subject: {
        type: String,
        required: true,
        minLength: postConstants_1.postModelConstants.subjectMin,
        maxlength: postConstants_1.postModelConstants.subjectMax,
    },
    // TODO add location
    // location: {
    //     type: String,
    // },
    description: {
        type: String,
        required: true,
        minlength: postConstants_1.postModelConstants.descriptionMin,
        maxlength: postConstants_1.postModelConstants.descriptionMax,
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be a positive number"],
    },
    category: {
        type: mongoose_1.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    number_of_comments: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
postSchema.set("toJSON", { virtuals: true });
postSchema
    .virtual("dateCreatedFormatted")
    .get(function () {
    return moment(this.createdAt).format("MMMM Do, YYYY, h:mm a");
});
exports.Post = mongoose_1.model("Post", postSchema);
//# sourceMappingURL=post.js.map