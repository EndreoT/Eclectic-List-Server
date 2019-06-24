"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as jwt from "jwt-simple";
const jwt = require("jsonwebtoken");
const passport = require("passport");
const moment = require("moment");
const passport_jwt_1 = require("passport-jwt");
const user_1 = require("../models/user");
const image_1 = require("../models/image");
const secret = process.env.secret;
class Auth {
    constructor() {
        this.authenticate = (callback) => passport.authenticate("jwt", { session: false, failWithError: true }, callback);
        // public authenticate = () => passport.authenticate("jwt", { session: false, failWithError: true });
        // public authenticate = (req: Request, res: Response, next: NextFunction) => {
        //     passport.authenticate("jwt", { session: false, failWithError: true })(req, res, next);
        // };
        this.validateJWT = (req, res, next) => {
            this.authenticate(function (err, user, info) {
                console.log(err);
                console.log(user);
                console.log(info);
                // if (err) { return next(err); }
                // if (!user) { return res.redirect('/login'); }
                // req.logIn(user, function(err) {
                //   if (err) { return next(err); }
                //   return res.json(user);
                // });
                req.login(user, { session: false }, async (error) => {
                    if (error)
                        return next(error);
                    return res.json({ user });
                });
            })(req, res, next);
        };
        this.genToken = (user) => {
            const expires = moment().utc().add({ days: 7 }).unix();
            const body = { _id: user._id, username: user.username, email: user.email };
            //Sign the JWT token and populate the payload with the user email and id
            const token = jwt.sign({ user: body }, secret);
            // const token: string = jwt.sign({
            //     user:
            //         exp: expires,
            //     username: user.username
            // }, process.env.JWT_SECRET);
            return {
                token,
                expires: moment.unix(expires).format(),
                user,
            };
        };
        // // Signup authentication
        this.signup = async (req, res, next) => {
            // usernameField: "username",
            // passwordField: "password",
            // passReqToCallback: true,
            try {
                // Determine if username or password already exists
                const result = await Promise.all([
                    user_1.User.findOne({ email: req.body.email }),
                    user_1.User.findOne({ username: req.body.username }),
                    image_1.Image.find({ caption: 'default' })
                ]);
                if (result[0] || result[1]) {
                    return res.json({ message: "Username or email already exists." });
                }
                else if (!result[2]) {
                    return res.json({ message: "Cannot save. No default avatar image exists" });
                }
                else {
                    // Success. Create new user
                    const user = new user_1.User({
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                        avatar_image: result[2][0]._id,
                    });
                    const savedUser = await user.save();
                    const populatedUser = await user_1.User.findById(savedUser._id).populate("avatar_image");
                    return res.json({ populatedUser, message: "Signup successful." });
                }
            }
            catch (error) {
                return res.json(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                // req.checkBody("username", "Invalid username").notEmpty();
                // req.checkBody("password", "Invalid password").notEmpty();
                // let errors = req.validationErrors();
                // if (errors) throw errors;
                const user = await user_1.User.findOne({ "username": req.body.username }).exec();
                if (user === null)
                    throw new Error("User not found");
                const success = await user.isValidPassword(req.body.password);
                if (!success)
                    throw new Error("Invalid password");
                const token = this.genToken(user);
                return res.status(200).json(token);
            }
            catch (err) {
                console.log(err);
                return res.status(401).json({ "message": "Invalid credentials", "errors": err });
            }
        };
        this.getStrategy = () => {
            const params = {
                secretOrKey: process.env.secret,
                jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
            };
            return new passport_jwt_1.Strategy(params, (req, payload, done) => {
                user_1.User.findOne({ "_id": payload.user._id }, (err, user) => {
                    /* istanbul ignore next: passport response */
                    console.log(err);
                    console.log(user);
                    if (err) {
                        return done(err);
                    }
                    /* istanbul ignore next: passport response */
                    if (user === null) {
                        return done(null, false, { message: "The user in the token was not found" });
                    }
                    return done(null, { _id: user._id, username: user.username });
                });
            });
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
        };
        passport.use("jwt", this.getStrategy());
        passport.initialize();
    }
}
exports.auth = new Auth();
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
//# sourceMappingURL=authController.js.map