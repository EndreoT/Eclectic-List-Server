import { Request, Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import * as moment from "moment";
import { Strategy, ExtractJwt } from "passport-jwt";

import { IUser, User } from "../models/user";

import { Image } from '../models/image';
import * as validate from '../validation/validation';
import { ValidationError } from "joi";

const JWT_SECRET: any = process.env.JWT_SECRET;

interface IauthSuccessObj {
    user: IUser;
    token: string;
    expires: string;
}

class Auth {

    initialize = () => {
        passport.use('jwt', this.getStrategy());
        return passport.initialize();
    }

    /**
     * Calls Passport's authentication strategy
     */
    private authenticate = (callback: any): any => {
        return passport.authenticate('jwt', { session: false, failWithError: true }, callback);
    };

    /**
     * Create a JSON Web Token (JWT)
     */
    private genToken = (user: IUser): IauthSuccessObj => {
        const expiresInDays = 7;
        const expires: number = moment().utc().add({ days: 7 }).unix();
        const body = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user: body }, JWT_SECRET, { expiresIn: String(expiresInDays) + 'd' });

        return {
            token,
            expires: moment.unix(expires).format(),
            user,
        };
    };

    validateJWT = (req: Request, res: Response, next: NextFunction) => {
        return this.authenticate((err: string, user: IUser, info: any) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                if (info.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Your token has expired. Please generate a new one' });
                } else {
                    return res.status(401).json({ message: info.message });
                }
            }
            next();
        })(req, res, next);
    }

    /**
     * Validates that the user id in res.locals.userIdLocation is equal to the user id provided in their JWT
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    authorizeUser = (req: Request, res: Response, next: NextFunction) => {
        return this.authenticate((err: string, user: IUser, info: any) => {

            if (err) {
                return next(err);
            }
            if (!user) {
                if (info.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Your token has expired. Please generate a new one' });
                } else {
                    return res.status(401).json({ message: info.message });
                }
            }

            res.locals.authenticatedUser = user;
            return next();
        })(req, res, next);
    }

    /**
     *  Signup authentication
     * @param {*} req
     * @param {*} res
     */
    signup = async (req: Request, res: Response, next: NextFunction) => {
        const { error }: { error: ValidationError } = validate.validateCreateUser(req.body);
        if (error) {
            return res.status(400).json(error.details[0]);
        }

        try {
            // Determine if username or email already exists
            const result = await Promise.all(
                [
                    User.findOne({ email: req.body.email }),
                    User.findOne({ username: req.body.username }),
                    Image.find({ caption: 'default' }),
                ]
            );
            if (result[0] || result[1]) {
                return res.status(401).json({ message: "Username or email already exists." });
            } else if (!result[2]) {
                return res.status(401).json({ message: "Cannot save. No default avatar image exists" });
            } else {
                // Success. Create new user
                const user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar_image: result[2][0]._id,
                });
                const savedUser: IUser = await user.save();
                const populatedUser: IUser | null = await User.findById(savedUser._id).populate("avatar_image");
                if (populatedUser) {
                    const authSuccess: IauthSuccessObj = this.genToken(populatedUser);
                    return res.json(authSuccess);
                }
                return res.status(401).json({ "message": `User with id ${savedUser._id} does not exist` });
            }
        } catch (error) {
            return res.json(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { error }: { error: ValidationError } = validate.validateAuthenticateUser(req.body);
            if (error) {
                return res.status(400).json(error.details[0]);
            }

            const user: IUser | null = await User.findOne({ "email": req.body.email })
                .select('username email avatar_image password').populate('avatar_image');

            if (!user) return res.status(401).json({ "message": "User not found" });

            const success: boolean = await user.isValidPassword(req.body.password);
            // Remove password
            user.password = '';
            if (!success) return res.status(401).json({ "message": "Invalid password" });

            const authSuccess: IauthSuccessObj = this.genToken(user);
            return res.status(200).json(authSuccess);
        } catch (err) {
            console.log(err);
            return res.status(401).json({ "message": "Invalid credentials", "errors": err });
        }
    }

    /**
     * Initializes Passport strategy
     */
    private getStrategy = (): Strategy => {
        const params = {
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
        };

        return new Strategy(params, (req: any, payload: any, done: any) => {
            User.findOne({ "_id": payload.user._id }, (err, user) => {
                if (err) {
                    return done(err);
                }

                if (user === null) {
                    return done(null, false, { message: "The user in the token was not found" });
                }

                return done(null, { _id: user._id, username: user.username });
            })
                .catch(err => {
                    console.log('err', err);
                });
        });
    }
}

export const auth: Auth = new Auth();




// class Auth {

//     // constructor() {
//     //     passport.use("jwt", this.getStrategy());
//     // }

//     initialize() {
//         passport.use("jwt", this.getStrategy());
//         return passport.initialize();
//     }

//     private authenticate = (callback: any): any => {
//         return passport.authenticate("jwt", { session: false, failWithError: true }, callback);
//     };

//     validateJWT = (req: Request, res: Response, next: NextFunction) => {
//         return this.authenticate((err: string, user: IUser, info: any) => {
//             if (err) {
//                 return next(err);
//             }
//             if (!user) {
//                 if (info.name === "TokenExpiredError") {
//                     return res.status(401).json({ message: "Your token has expired. Please generate a new one" });
//                 } else {
//                     return res.status(401).json({ message: info.message });
//                 }
//             }
//             next();
//         })(req, res, next);
//     }

//     private authorizeUser = (req: Request, res: Response, next: NextFunction) => {
//         return this.authenticate((err: string, user: IUser, info: any) => {
//             if (err) {
//                 return next(err);
//             }
//             if (!user) {
//                 if (info.name === "TokenExpiredError") {
//                     return res.status(401).json({ message: "Your token has expired. Please generate a new one" });
//                 } else {
//                     return res.status(401).json({ message: info.message });
//                 }
//             }
//             if (String(user._id) !== res.locals.userIdLocation) {
//                 return res.status(401).json({ message: "userId in request body does not match user id in JWT" });
//             }
//             return next();

//         })(req, res, next);
//     }

//     authorizeUserBody = (req: Request, res: Response, next: NextFunction) => {
//         res.locals.userIdLocation = req.body.userId;
//         return this.authorizeUser(req, res, next);
//     }

//     authorizeUserParams = (req: Request, res: Response, next: NextFunction) => {
//         res.locals.userIdLocation = req.params.userId;
//         return this.authorizeUser(req, res, next);
//     }

//     private genToken = (user: IUser): IauthSuccessObj => {
//         const expiresInDays = 7;
//         const expires: number = moment().utc().add({ days: 7 }).unix();
//         const body = {
//             _id: user._id,
//             username: user.username,
//             email: user.email,
//         };
//         //Sign the JWT token and populate the payload with the user email and id
//         const token: string = jwt.sign({ user: body }, JWT_SECRET, { expiresIn: String(expiresInDays) + 'd' });

//         return {
//             token,
//             expires: moment.unix(expires).format(),
//             user,
//         };
//     }

//     // // Signup authentication
//     signup = async (req: Request, res: Response, next: NextFunction) => {
//         const { error }: { error: ValidationError } = validate.validateCreateUser(req.body);
//         if (error) {
//             return res.status(400).json(error.details[0]);
//         }

//         try {
//             // Determine if username or email already exists
//             const result = await Promise.all(
//                 [
//                     User.findOne({ email: req.body.email }),
//                     User.findOne({ username: req.body.username }),
//                     Image.find({ caption: 'default' }),
//                 ]
//             );
//             if (result[0] || result[1]) {
//                 return res.json({ message: "Username or email already exists." });
//             } else if (!result[2]) {
//                 return res.json({ message: "Cannot save. No default avatar image exists" });
//             } else {
//                 // Success. Create new user
//                 const user = new User({
//                     username: req.body.username,
//                     email: req.body.email,
//                     password: req.body.password,
//                     avatar_image: result[2][0]._id,
//                 });
//                 const savedUser: IUser = await user.save();
//                 const populatedUser: IUser | null = await User.findById(savedUser._id).populate("avatar_image");
//                 if (populatedUser) {
//                     const authSuccess: IauthSuccessObj = this.genToken(populatedUser);
//                     return res.json(authSuccess);
//                 }
//                 throw new Error(`User with id ${savedUser._id} does not exist`);
//             }
//         } catch (error) {
//             return res.json(error);
//         }
//     }

//     login = async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const { error }: { error: ValidationError } = validate.validateAuthenticateUser(req.body);
//             if (error) {
//                 return res.status(400).json(error.details[0]);
//             }

//             const user: IUser | null = await User.findOne({ "username": req.body.username }).populate('avatar_image');

//             if (!user) throw new Error("User not found");

//             const success: boolean = await user.isValidPassword(req.body.password);
//             if (!success) throw new Error("Invalid password");


//             const authSuccess: IauthSuccessObj = this.genToken(user);
//             return res.status(200).json(authSuccess);
//         } catch (err) {
//             console.log(err);
//             return res.status(401).json({ "message": "Invalid credentials", "errors": err });
//         }
//     }

//     private getStrategy = (): Strategy => {
//         const params = {
//             secretOrKey: JWT_SECRET,
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             passReqToCallback: true,
//         };

//         return new Strategy(params, (req: any, payload: any, done: any) => {
//             User.findOne({ "_id": payload.user._id }, (err, user) => {
//                 if (err) {
//                     return done(err);
//                 }

//                 if (user === null) {
//                     return done(null, false, { message: "The user in the token was not found" });
//                 }

//                 return done(null, { _id: user._id, username: user.username });
//             })
//                 .catch(err => {
//                     console.log('err', err);
//                 });
//         });
//     }
// }

// export const auth: Auth = new Auth();




// import { sanitizeBody } from "express-validator/filter";
// import * as passport from "passport";
// import { Strategy, ExtractJwt } from "passport-jwt";
// import * as ExtractJWTImport from 'passport-jwt';
// import * as JwtStrategy from 'passport-jwt').Strategy;
// import  {s} from "passport-local");


// const ExtractJwt = ExtractJWTImport.Strategy
// const JwtStrategy

// const secret: string | undefined = process.env.secret;
// import * as validation from "../validation/validation";
// import { Image } from '../models/image';
// import { User } from "../models/user";

// Authentication implementation for JSON Web Token
// passport.use(new Strategy({
//     secretOrKey: secret,
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// },
//     async (token, done) => {
//         try {
//             return done(null, token.user);
//         } catch (error) {
//             return done(error);
//         }
//     }
// ));

// // Signup authentication
// passport.use("signup", new LocalStrategy({
//     usernameField: "username",
//     passwordField: "password",
//     passReqToCallback: true,
// },
//     async (req, username, password, done) => {
//         try {
//             // Determine if username or password already exists
//             const result = await Promise.all([
//                 User.findOne({ email: req.body.email }),
//                 User.findOne({ username: username }),
//                 Image.find({ caption: 'default' })
//             ]);
//             if (result[0] || result[1]) {
//                 return done(null, false, { message: "Username or email already exists." })
//             } else if (!result[2]) {
//                 return done(null, false, { message: "Cannot save. No default avatar image exists" })
//             } else {
//                 // Success. Create new user
//                 const user = new User({
//                     username: username,
//                     email: req.body.email,
//                     password: password,
//                     avatar_image: result[2][0]._id
//                 });
//                 const savedUser = await user.save();
//                 const populatedUser = await User.findById(savedUser._id).populate("avatar_image")
//                 return done(null, populatedUser, { message: "Signup successful." });
//             }
//         } catch (error) {
//             return done(error);
//         }
//     }
// ));

// // Authentication during login
// passport.use("login", new LocalStrategy({
//     usernameField: "username",
//     passwordField: "password",
// }, async (username, password, done) => {
//     try {
//         const user = await User.findOne({ username: username }, '-password').populate("avatar_image");
//         if (!user) {
//             return done(null, false, { message: 'User not found.' });
//         }
//         const compare = await user.isValidPassword(password);
//         if (!compare) {
//             return done(null, false, { message: 'Incorrect Password.' });
//         }
//         return done(null, user, { message: "Authentication successful." });
//     } catch (error) {
//         return done(error);
//     }
// })
// );

// // Authentication middleware for JSON Web Tokens
// exports.authenticateJWT = passport.authenticate('jwt', { session: false });

// // Middleware to handle user registration/creation
// exports.signup = [
//     sanitizeBody("user_name").trim().escape(),
//     sanitizeBody("email").trim().escape(),
//     sanitizeBody("password").trim().escape(),
//     function validateUserInformation(req, res, next) {
//         const { error } = validation.validateCreateUser(req.body);
//         if (error) {
//             return res.status(400).json(error.details[0]);
//         }
//         next();
//     },
//     async function (req, res, next) {
//         passport.authenticate("signup", { session: false }, async function (err, user, info) {
//             try {
//                 if (err) { return next(err) }
//                 if (!user) { return res.status(400).json({ message: info.message }) }
//                 const token = await User.generateAuthToken(user);
//                 return res.json({ token: token, user: user });
//             } catch (error) {
//                 return next(error);
//             }
//         })(req, res, next);
//     },
// ];

// // Handle user login
// exports.login = [
//     // TODO Sanitize input??
//     async (req, res, next) => {
//         passport.authenticate('login', { session: false }, async (error, user, info) => {
//             try {
//                 if (error) return next(error);
//                 if (!user) {
//                     // User does not exist
//                     return res.status(400).json({ message: info.message });
//                 }
//                 req.login(user, { session: false }, async (error) => {
//                     if (error) return next(error);
//                     const token = await User.generateAuthToken(user);
//                     return res.json({ token, user: user });
//                 });
//             } catch (error) {
//                 return next(error);
//             }
//         })(req, res, next);
//     }
// ];
