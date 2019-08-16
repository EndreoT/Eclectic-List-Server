import * as bcrypt from "bcrypt";
import {Schema, Document, Types, Model, model, HookNextFunction} from 'mongoose';


const secret: any = process.env.secret;

const saltRounds = 12; // TODO make global


export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    number_of_posts: number;
    avatar_image: Types.ObjectId;
    isValidPassword(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 1,
        maxlength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        // select: false,
        minlength: 3,
        maxlength: 255,
        unique: true,
        trim: true,
    },
    password: { // Encrypted using bcrypt
        type: String,
        required: true,
        select: false,
        minlength: 3,
        maxlength: 255,
        trim: true,
    },
    number_of_posts: {
        type: Number,
        default: 0,
    },
    avatar_image: {
        type: Types.ObjectId,
        ref: 'Image',
        required: true,
    },
},
    { timestamps: true }
);

userSchema.pre("save", async function (this: IUser, next: HookNextFunction): Promise<any> {
    try {
        // Hash password on save document
        const hash: string = await bcrypt.hash(this.password, saltRounds);
        this.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
    try {
        const compare: boolean = await bcrypt.compare(password, this.password);
        return compare;
    } catch (error) {
        return error;
    }
};

export const User: Model<IUser> = model<IUser>("User", userSchema);
