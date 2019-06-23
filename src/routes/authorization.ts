import * as express from "express";

// import authController = require("../controllers/authController");

const router: express.Router = express.Router();


// router.get('/', authController.authenticateJWT);

// router.post('/signup', authController.signup);

// router.post("/login", authController.login);

export const authRouter = router;
