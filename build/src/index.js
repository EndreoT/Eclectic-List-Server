"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Third party dependencies
require('dotenv').config();
// const admin = require("sriracha"); //For dev only
const process = require("process");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
// Internal middleware
const authController_1 = require("./controllers/authController");
// Routes
const authorization_1 = require("./routes/authorization");
const categoryRoutes_1 = require("./routes/categoryRoutes");
const commentRoutes_1 = require("./routes/commentRoutes");
const imageRoutes_1 = require("./routes/imageRoutes");
const postRoutes_1 = require("./routes/postRoutes");
const userRoutes_1 = require("./routes/userRoutes");
class App {
    constructor() {
        this.app = express();
        this.initApp();
    }
    initApp() {
        this.initDB();
        this.initMiddleware();
        this.initRoutes();
        this.initExpressConnection();
    }
    // Connect to mongoose DB
    initDB() {
        // Local DB
        // const mongoDB = process.env.MONGODB_URI || process.env.localhostDB;
        let mongoDBUrl;
        if (process.env.MONGODB_URI) { // Path to production mongoDB
            mongoDBUrl = process.env.MONGODB_URI;
        }
        else if (process.env.mLabDB) { // Path to remote mLab DB
            mongoDBUrl = process.env.mLabDB;
        }
        else {
            throw new Error('MongoDB URI is undefined');
        }
        mongoose.connect(mongoDBUrl, { useNewUrlParser: true })
            .then(() => "You are now connected to Mongo!")
            .catch(err => console.error("Something went wrong!", err));
    }
    initMiddleware() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(morgan("tiny"));
        this.app.use(express.json());
        this.app.use(authController_1.auth.initialize());
    }
    initRoutes() {
        this.app.use("/api/categories", categoryRoutes_1.categoryRouter);
        this.app.use("/api/comments", commentRoutes_1.commentRouter);
        this.app.use("/api/posts", postRoutes_1.postRouter);
        this.app.use("/api/auth", authorization_1.authRouter);
        this.app.use('/api/images', imageRoutes_1.imageRouter);
        this.app.use('/users', userRoutes_1.userRouter);
    }
    initExpressConnection() {
        const port = process.env.PORT || 4000;
        this.app.listen(port, () => console.log(`Listening on port ${port}...`));
    }
}
const app = new App();
//# sourceMappingURL=index.js.map