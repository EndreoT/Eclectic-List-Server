import { Document, Model } from 'mongoose';
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    number_of_posts: number;
    isValidPassword: Function;
}
export declare const User: Model<IUser>;
