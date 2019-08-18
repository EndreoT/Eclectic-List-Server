"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const folders = new Set(['avatar', 'postImage']);
const imageSchema = new mongoose_1.Schema({
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
            validator(v) {
                return folders.has(v);
            },
        },
    },
    post: {
        type: mongoose_1.Types.ObjectId,
        required: false,
        ref: 'Post',
    },
    src_attribution: {
        type: String,
        default: '',
    },
}, { timestamps: true });
exports.Image = mongoose_1.model('Image', imageSchema);
//# sourceMappingURL=image.js.map