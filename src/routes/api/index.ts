import * as express from "express";

import {userRouter} from './userRoutes';
import {categoryRouter} from './categoryRoutes';
import {imageRouter} from './imageRoutes';
import {postRouter} from './postRoutes';
import {commentRouter} from './commentRoutes';

const router: express.Router = express.Router();


// // User routes
router.use('/users', userRouter);

// Category routes
router.use('/category', categoryRouter);

// Post routes
router.use('/posts', postRouter);

// Comment routes
router.use('/comments', commentRouter);

// Image routes
router.use('/images', imageRouter);


export const apiRouter = router;
