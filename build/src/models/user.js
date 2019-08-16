"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const mongoose_1 = require("mongoose");
const secret = process.env.secret;
const saltRounds = 12; // TODO make global
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 1,
        maxlength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        // select: false,
        minlength: 3,
        maxlength: 255,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 3,
        maxlength: 255,
        trim: true,
    },
    number_of_posts: {
        type: Number,
        default: 0,
    },
    avatar_image: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Image',
        required: true,
    },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    try {
        // Hash password on save document
        const hash = await bcrypt.hash(this.password, saltRounds);
        this.password = hash;
        next();
    }
    catch (error) {
        return next(error);
    }
});
userSchema.methods.isValidPassword = async function (password) {
    try {
        const compare = await bcrypt.compare(password, this.password);
        return compare;
    }
    catch (error) {
        return error;
    }
};
exports.User = mongoose_1.model("User", userSchema);
//# sourceMappingURL=user.js.map