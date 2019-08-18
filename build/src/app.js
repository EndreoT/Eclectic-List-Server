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
const routes_1 = require("./routes");
class Application {
    constructor() {
        this.app = express();
        this.initApp();
    }
    initApp() {
        this.initDB();
        this.initMiddleware();
        this.initRoutes();
    }
    getExpressServer() {
        return this.app;
    }
    // Connect to mongoose DB
    initDB() {
        // Local DB
        // const mongoDB = process.env.MONGODB_URI || process.env.localhostDB;
        let mongoDBUrl;
        if (process.env.MONGODB_URI) { // Path to production mongoDB
            mongoDBUrl = process.env.MONGODB_URI;
        }
        else {
            mongoDBUrl = (process.env.NODE_ENV === 'test') ? 'mongodb://localhost/test-eclectic-list' : process.env.mLabDB;
        }
        if (!mongoDBUrl) {
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
        this.app.use(routes_1.appRouter);
    }
    initExpressConnection() {
        const port = process.env.PORT || (process.env.NODE_ENV === 'test' ? 4001 : 4000);
        this.app.listen(port, () => console.log(`Listening on port ${port}...`));
    }
}
const mongodbUrl = process.env.MONGODB_URI || (process.env.NODE_ENV === 'test' ? 'mongodb://localhost/testcodemeetup' : 'mongodb://localhost/codemeetup');
exports.default = Application;
//# sourceMappingURL=app.js.map