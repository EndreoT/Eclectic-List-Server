const moment = require("moment");
const mongoose = require("mongoose");

const constants = require("../constants/postConstants");

const commentSchema = mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
            minLength: constants.subjectMin,
            maxlength: constants.subjectMax
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

commentSchema.set("toJSON", { virtuals: true });

commentSchema
    .virtual("dateCreatedFormatted")
    .get(function () {
        return moment(this.createdAt).format("MMMM Do, YYYY, h:mm a");
    });

module.exports = mongoose.model("Comment", commentSchema);
