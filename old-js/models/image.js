const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const folders = new Set(['avatar', 'postImage']);

const imageSchema = new Schema(
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
                validator: function (v) {
                    return folders.has(v);
                },
                message: "Forbidden folder name."
            },
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        src_attribution: {
            type: String,
            default: '',
        }
    },
    { timestamps: true },
);

module.exports = mongoose.model('Image', imageSchema);