const User = require("../models/user");

exports.getAllUsers = async function (req, res, next) {
    try {
        const users = await User.find({}, "username number_of_posts avatar_image").populate("avatar_image");
        return res.json(users);
    } catch (error) {
        return next(error);
    }
};

// Get user by name
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.user }, "username number_of_posts avatar_image").populate("avatar_image");
        if (user) return res.status(200).json(user);
        return res.status(404).json({ message: `User '${req.params.user} does not exist.'` });
    } catch (error) {
        return next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById({ username: req.params.user }, "username number_of_posts avatar_image").populate("avatar_image");
        if (user) return res.status(200).json(user);
        return res.status(404).json({ message: `User id '${req.params.user} does not exist.'` });
    } catch (error) {
        return next(error);
    }
};

// Retrieves all data about user except password
exports.getFullUser = async (req, res, next) => {
    try {
        if (req.user._id !== req.params.userId) { //req.user field is added to response by passport.js authentication
            return res.status(401).send("Credentials do not match.");
        }
        const user = await User.findById(req.params.userId, "-password");
        if (user) return res.status(200).json(user);
        return res.status(404).json({ message: `User '${req.params.user} does not exist.'` });
    } catch (error) {
        next(error);
    }
};
