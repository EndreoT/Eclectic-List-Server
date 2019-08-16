import * as express from "express";

import {authRouter} from  './auth';
import {apiRouter} from './api';

const router: express.Router = express.Router();


// API Routes
router.use('/api', apiRouter);

// Auth Routes
router.use('/auth', authRouter);

export const appRouter = router;
