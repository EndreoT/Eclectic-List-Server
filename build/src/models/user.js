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
    },
    email: {
        type: String,
        required: true,
        select: false,
        minlength: 1,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 6,
        maxlength: 1024,
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
// interface IAuthTokenUserData {
//     _id: string;
//     username: string;
//     email: string;
// }
// userSchema.statics.generateAuthToken = function (userData: IAuthTokenUserData): string {
//     //We don't want to store the sensitive information such as the
//     //user password in the token so we pick only the email and id
//     const body: IAuthTokenUserData = { _id: userData._id, username: userData.username, email: userData.email };
//     //Sign the JWT token and populate the payload with the user email and id
//     const token = jwt.sign({ user: body }, secret,
//         //  {expiresIn: "1h"}                      <- Change for production??
//     );
//     return token;
// };
exports.User = mongoose_1.model("User", userSchema);
//# sourceMappingURL=user.js.map