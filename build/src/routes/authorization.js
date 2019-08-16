"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authController_1 = require("../controllers/authController");
const internalMiddleware = require("../middleware/middleware");
const router = express.Router();
router.post('/validate', authController_1.auth.validateJWT, (req, res, next) => {
    res.json({ message: 'token is valid' });
});
router.post('/signup', internalMiddleware.sanitizeUser, authController_1.auth.signup);
router.post("/login", authController_1.auth.login);
// For testing JWT in header
router.route('/protected/:id')
    .get(authController_1.auth.authorizeUser, (req, res) => {
    console.log('made it to protected route');
    const authenticatedUser = res.locals.authenticatedUser;
    if (authenticatedUser._id.toString() !== req.params.id) {
        return res.status(422).json({ message: 'You are not authorized to perform this action' });
    }
    return res.json({ message: 'I\'m protected!' });
});
exports.authRouter = router;
//# sourceMappingURL=authorization.js.map