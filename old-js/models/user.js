const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const secret = process.env.secret;

const saltRounds = 12; // TODO make global

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        select: false,
        minlength: 1,
        maxlength: 255,
        unique: true
    },
    password: { // Encrypted using bcrypt
        type: String,
        required: true,
        select: false,
        minlength: 6,
        maxlength: 1024
    },
    number_of_posts: {
        type: Number,
        default: 0,
    },
    avatar_image: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        required: true,
    },
},
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    try {
        // Hash password on save document
        const hash = await bcrypt.hash(this.password, saltRounds);
        this.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.isValidPassword = async function (password) {
    try {
        const compare = await bcrypt.compare(password, this.password);
        return compare;
    } catch (error) {
        return error;
    }
};

userSchema.statics.generateAuthToken = function (user) {

    //We don't want to store the sensitive information such as the
    //user password in the token so we pick only the email and id
    const body = { _id: user._id, username: user.username, email: user.email };
    //Sign the JWT token and populate the payload with the user email and id
    const token = jwt.sign({ user: body }, secret,
        //  {expiresIn: "1h"}                      <- Change for production??
    );
    return token;
};

module.exports = mongoose.model("User", userSchema);
