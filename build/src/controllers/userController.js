"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
async function getAllUsers(req, res, next) {
    try {
        const users = await user_1.User.find({}, "username number_of_posts avatar_image").populate("avatar_image");
        // const users: IUser[] = await User.find({}, "username number_of_posts avatar_image").populate('number_of_posts')
        return res.json(users);
    }
    catch (error) {
        return next(error);
    }
}
exports.getAllUsers = getAllUsers;
// Get user by name
async function getUser(req, res, next) {
    try {
        const user = await user_1.User.findOne({ username: req.params.user }, "username number_of_posts avatar_image").populate("avatar_image");
        if (user)
            return res.status(200).json(user);
        return res.status(404).json({ message: `User '${req.params.user} does not exist.'` });
    }
    catch (error) {
        return next(error);
    }
}
exports.getUser = getUser;
async function getUserById(req, res, next) {
    try {
        const user = await user_1.User.findById({ username: req.params.user }, "username number_of_posts avatar_image").populate("avatar_image");
        if (user)
            return res.status(200).json(user);
        return res.status(404).json({ message: `User id '${req.params.user} does not exist.'` });
    }
    catch (error) {
        return next(error);
    }
}
exports.getUserById = getUserById;
// Retrieves all data about user except password
async function getFullUser(req, res, next) {
    try {
        if (req.user._id !== req.params.userId) { //req.user field is added to response by passport.js authentication
            return res.status(401).send("Credentials do not match.");
        }
        const user = await user_1.User.findById(req.params.userId, "-password");
        if (user)
            return res.status(200).json(user);
        return res.status(404).json({ message: `User '${req.params.user} does not exist.'` });
    }
    catch (error) {
        return next(error);
    }
}
exports.getFullUser = getFullUser;
//# sourceMappingURL=userController.js.map