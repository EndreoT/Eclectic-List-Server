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
// Routes
// import authRoutes = require("./routes/authorization");
const categoryRoutes_1 = require("./routes/categoryRoutes");
// import commentRoutes = require("./routes/commentRoutes");
// import imageRoutes = require("./routes/imageRoutes");
// import postRoutes = require("./routes/postRoutes");
// import userRoutes = require("./routes/userRoutes");
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
    initDB() {
        let mongoDBUrl;
        if (process.env.MONGODB_URI) {
            mongoDBUrl = process.env.MONGODB_URI;
        }
        else if (process.env.mLabDB) {
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
    }
    initRoutes() {
        this.app.use("/api/categories", categoryRoutes_1.categoryRouter);
        // app.use("/api/comments", commentRoutes);
        // app.use("/api/posts", postRoutes);
        // app.use("/api/auth", authRoutes);
        // app.use('/api/images', imageRoutes);
        // app.use('/users', userRoutes);
    }
    initExpressConnection() {
        const port = process.env.PORT || 4000;
        this.app.listen(port, () => console.log(`Listening on port ${port}...`));
    }
}
const app = new App();
// Express app
// const app: express.Application = express();
// let mongoDBUrl: string;
// if (process.env.MONGODB_URI) {
//     mongoDBUrl = process.env.MONGODB_URI;
// } else if (process.env.mLabDB) {
//     mongoDBUrl = process.env.mLabDB;
// } else {
//     throw new Error('MongoDB URI is undefined');
// }
// Path to remot mLab DB
// const mongoDB = process.env.MONGODB_URI || process.env.mLabDB;
// Local DB
// const mongoDB = process.env.MONGODB_URI || process.env.localhostDB;
// Connect to mongoose DB
// mongoose.connect(mongoDBUrl, { useNewUrlParser: true })
//     .then(() => "You are now connected to Mongo!")
//     .catch(err => console.error("Something went wrong!", err));
// app.use("/admin", admin());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cors());
// app.use(morgan("tiny"));
// app.use(express.json());
// app.use("/api/categories", categoryRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/auth", authRoutes);
// app.use('/api/images', imageRoutes);
// app.use('/users', userRoutes);
// const port: string | number = process.env.PORT || 4000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));
//# sourceMappingURL=index.js.map