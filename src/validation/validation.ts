// Validation for POST and PUT requests

import * as Joi from "joi";

import {postModelConstants} from "../constants/postConstants";
import {IPost} from '../models/post';
import {IUser} from '../models/user';
import {IComment} from '../models/comment';


// Validate post fields
export function validatePost(post: IPost): Joi.ValidationResult<IPost> {
    const schema = {
        subject: Joi.string().min(postModelConstants.subjectMin).max(postModelConstants.subjectMax).required(),
        description: Joi.string().min(postModelConstants.descriptionMin).max(postModelConstants.descriptionMax).required(),
        price: Joi.number().min(0).precision(2).required(),
        category: Joi.string().required(),
        userId: Joi.string().required(),
    };
    return Joi.validate(post, schema);
}

// Validate fields during user signup
export function validateCreateUser(user: IUser): Joi.ValidationResult<IUser> {
    const schema = {
        username: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
}

// Validate on login
export function validateAuthenticateUser(user: IUser): Joi.ValidationResult<IUser> {
    const schema = {
        username: Joi.string().min(1).max(50).required(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
}

// Validate comment fields
export function validateComment(comment: IComment): Joi.ValidationResult<IComment> {
    const schema = {
        comment: Joi.string().min(postModelConstants.subjectMin).max(postModelConstants.subjectMax).required(),
        postId: Joi.string().required(),
        userId: Joi.string().required(),
    };
    return Joi.validate(comment, schema);
}
