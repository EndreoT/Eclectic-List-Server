// const { sanitizeBody } = require("express-validator/filter");
// const passport = require("passport");
// const ExtractJWT = require('passport-jwt').ExtractJwt;
// const JwtStrategy = require('passport-jwt').Strategy;
// const LocalStrategy = require("passport-local").Strategy;

// const secret = process.env.secret;
// const validation = require("../validation/validation");
// const Image = require('../models/image');
// const User = require("../models/user");

// // Authentication implementation for JSON Web Token
// passport.use(new JwtStrategy({
//     secretOrKey: secret,
//     jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
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
