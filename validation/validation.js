// Validation for POST and PUT requests

const Joi = require("joi");

const constants = require("../constants/postConstants");

// Validate post fields
function validatePost(post) {
    const schema = {
        subject: Joi.string().min(constants.subjectMin).max(constants.subjectMax).required(),
        description: Joi.string().min(constants.descriptionMin).max(constants.descriptionMax).required(),
        price: Joi.number().min(0).precision(2).required(),
        category: Joi.string().required(),
        userId: Joi.string().required(),
    };
    return Joi.validate(post, schema);
};

// Validate fields during user signup
function validateCreateUser(user) {
    const schema = {
        username: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
};

// Validate on login
function validateAuthenticateUser(user) {
    const schema = {
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
};

// Validate comment fields
function validateComment(comment) {
    const schema = {
        comment: Joi.string().min(constants.subjectMin).max(constants.subjectMax).required(),
        postId: Joi.string().required(),
        userId: Joi.string().required(),
    }
    return Joi.validate(comment, schema);
};

module.exports = {
    validatePost,
    validateCreateUser,
    validateAuthenticateUser,
    validateComment,
};
