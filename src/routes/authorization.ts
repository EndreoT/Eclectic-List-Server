import * as express from "express";

import {auth} from "../controllers/authController";

const router: express.Router = express.Router();


router.post('/validate', auth.validateJWT);

router.post('/signup', auth.signup);

router.post("/login", auth.login);

export const authRouter = router;
