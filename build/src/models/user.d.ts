import { Document, Types, Model } from 'mongoose';
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    number_of_posts: number;
    avatar_image: Types.ObjectId;
    isValidPassword: Function;
}
export declare const User: Model<IUser>;
