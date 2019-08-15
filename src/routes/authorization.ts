import * as express from "express";

import { auth } from "../controllers/authController";
import * as internalMiddleware from '../middleware/middleware';


const router: express.Router = express.Router();


router.post('/validate', auth.validateJWT, (req, res, next) => {
  res.json({ message: 'token is valid' });
});

router.post('/signup', internalMiddleware.sanitizeUser, auth.signup);

router.post("/login", auth.login);

// For testing JWT in header
router.route('/protected/:id')
  .get(auth.authorizeUser, (req, res) => {
    console.log('made it to protected route');
    const authenticatedUser: any = res.locals.authenticatedUser;

    if (authenticatedUser._id.toString() !== req.params.id) {
      return res.status(422).json({ message: 'You are not authorized to perform this action' });
    }
    return res.json({ message: 'I\'m protected!' });
  });

export const authRouter = router;
