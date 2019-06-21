// const moment = require("moment");
// const mongoose = require("mongoose");

// const constants = require("../constants/postConstants");

// const postSchema = mongoose.Schema(
//     {
//         subject: {
//             type: String,
//             required: true,
//             minLength: constants.subjectMin,
//             maxlength: constants.subjectMax
//         },
//         // TODO add location
//         // location: {
//         //     type: String,
//         // },
//         description: {
//             type: String,
//             required: true,
//             minlength: constants.descriptionMin,
//             maxlength: constants.descriptionMax
//         },
//         price: {
//             type: Number,
//             required: true,
//             validate: {
//                 validator: function (v) {
//                     return v >= 0;
//                 },
//                 message: "Price must be greater than or equal to $0.00"
//             }
//         },
//         category: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Category",
//             required: true
//         },
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         number_of_comments: {
//             type: Number,
//             default: 0,
//         },
//         // images: [{ // <- Image model stores ref to post instead
//         //     type: mongoose.Schema.Types.ObjectId,
//         //     ref: 'Image',
//         //     required: false,
//         // }],
//     },
//     { timestamps: true }
// );

// postSchema.set("toJSON", { virtuals: true });

// postSchema
//     .virtual("dateCreatedFormatted")
//     .get(function () {
//         return moment(this.createdAt).format("MMMM Do, YYYY, h:mm a");
//     });
    
// module.exports = mongoose.model("Post", postSchema);
