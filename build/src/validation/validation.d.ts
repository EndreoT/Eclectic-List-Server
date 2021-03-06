import * as Joi from "joi";
import { IPost } from '../models/post';
import { IUser } from '../models/user';
import { IComment } from '../models/comment';
export declare function validatePost(post: IPost): Joi.ValidationResult<IPost>;
export declare function validateCreateUser(user: IUser): Joi.ValidationResult<IUser>;
export declare function validateAuthenticateUser(user: IUser): Joi.ValidationResult<IUser>;
export declare function validateComment(comment: IComment): Joi.ValidationResult<IComment>;
