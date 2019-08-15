"use strict";
// Validation for POST and PUT requests
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const postConstants_1 = require("../constants/postConstants");
// Validate post fields
function validatePost(post) {
    const schema = {
        subject: Joi.string().min(postConstants_1.postModelConstants.subjectMin).max(postConstants_1.postModelConstants.subjectMax).required(),
        description: Joi.string().min(postConstants_1.postModelConstants.descriptionMin).max(postConstants_1.postModelConstants.descriptionMax).required(),
        price: Joi.number().min(0).precision(2).required(),
        category: Joi.string().required(),
    };
    return Joi.validate(post, schema);
}
exports.validatePost = validatePost;
// Validate fields during user signup
function validateCreateUser(user) {
    const schema = {
        username: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
}
exports.validateCreateUser = validateCreateUser;
// Validate on login
function validateAuthenticateUser(user) {
    const schema = {
        email: Joi.string().min(1).max(50).required(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
}
exports.validateAuthenticateUser = validateAuthenticateUser;
// Validate comment fields
function validateComment(comment) {
    const schema = {
        comment: Joi.string().min(postConstants_1.postModelConstants.subjectMin).max(postConstants_1.postModelConstants.subjectMax).required(),
        postId: Joi.string().required(),
        userId: Joi.string().required(),
    };
    return Joi.validate(comment, schema);
}
exports.validateComment = validateComment;
//# sourceMappingURL=validation.js.map