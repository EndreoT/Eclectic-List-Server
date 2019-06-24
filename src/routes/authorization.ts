import * as express from "express";

import {auth} from "../controllers/authController";
import * as internalMiddleware from '../middleware/middleware';

const router: express.Router = express.Router();


router.post('/validate', auth.validateJWT);

router.post('/signup', internalMiddleware.sanitizeUser, auth.signup);

router.post("/login", auth.login);

export const authRouter = router;
