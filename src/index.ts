// Third party dependencies
require('dotenv').config();
// const admin = require("sriracha"); //For dev only
import * as process from 'process';
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from 'express';
import * as morgan from "morgan";
import * as mongoose from "mongoose";

// Internal middleware
import {auth} from "./controllers/authController";

// Routes
// import { authRouter } from "./routes/auth";
// import { categoryRouter } from './routes/api/categoryRoutes';
// import { commentRouter } from "./routes/api/commentRoutes";
// import { imageRouter } from "./routes/api/imageRoutes";
// import { postRouter } from "./routes/api/postRoutes";
// import { userRouter } from "./routes/api/userRoutes";

import {appRouter} from './routes';


class App {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.initApp();
    }

    private initApp(): void {
        this.initDB();
        this.initMiddleware();
        this.initRoutes();
        this.initExpressConnection();
    }

    // Connect to mongoose DB
    private initDB(): void {
        // Local DB
        // const mongoDB = process.env.MONGODB_URI || process.env.localhostDB;

        let mongoDBUrl: string;

        if (process.env.MONGODB_URI) { // Path to production mongoDB
            mongoDBUrl = process.env.MONGODB_URI;
        } else if (process.env.mLabDB) { // Path to remote mLab DB
            mongoDBUrl = process.env.mLabDB;
        } else {
            throw new Error('MongoDB URI is undefined');
        }

        mongoose.connect(mongoDBUrl, { useNewUrlParser: true })
            .then(() => "You are now connected to Mongo!")
            .catch(err => console.error("Something went wrong!", err));
    }

    private initMiddleware(): void {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(morgan("tiny"));
        this.app.use(express.json());
        this.app.use(auth.initialize());
    }

    private initRoutes(): void {
        // this.app.use("/api/categories", categoryRouter);
        // this.app.use("/api/comments", commentRouter);
        // this.app.use("/api/posts", postRouter);
        // this.app.use("/api/auth", authRouter);
        // this.app.use('/api/images', imageRouter);
        // this.app.use('/users', userRouter);
        this.app.use(appRouter);
    }

    private initExpressConnection(): void {
        const port: string | number = process.env.PORT || 4000;
        this.app.listen(port, () => console.log(`Listening on port ${port}...`));
    }
}

const app = new App();
