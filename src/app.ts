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
import { auth } from "./controllers/authController";

// Routes
import { appRouter } from './routes';


class Application {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.initApp();
    }

    private initApp(): void {
        this.initDB();
        this.initMiddleware();
        this.initRoutes();
    }

    getExpressServer(): express.Application {
        return this.app;
    }

    // Connect to mongoose DB
    private initDB(): void {
        // Local DB
        // const mongoDB = process.env.MONGODB_URI || process.env.localhostDB;

        let mongoDBUrl: string | undefined;

        if (process.env.MONGODB_URI) { // Path to production mongoDB
            mongoDBUrl = process.env.MONGODB_URI;
        } else { 
            mongoDBUrl = (process.env.NODE_ENV === 'test') ? 'mongodb://localhost/test-eclectic-list' : process.env.mLabDB
        } 
        if (!mongoDBUrl) {
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
        this.app.use(appRouter);
    }

    initExpressConnection(): void {
        const port: string | number = process.env.PORT || (process.env.NODE_ENV === 'test' ? 4001 : 4000);
        this.app.listen(port, () => console.log(`Listening on port ${port}...`));
    }
}


const mongodbUrl = process.env.MONGODB_URI || (process.env.NODE_ENV === 'test' ? 'mongodb://localhost/testcodemeetup' : 'mongodb://localhost/codemeetup');


export default Application;
