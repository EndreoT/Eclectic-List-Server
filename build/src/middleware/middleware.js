"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_1 = require("express-validator/filter");
function sanitizePost(req, res, next) {
    filter_1.sanitizeBody("subject").trim().escape();
    filter_1.sanitizeBody("description").trim().escape();
    filter_1.sanitizeBody("price").toFloat().trim().escape();
    next();
}
exports.sanitizePost = sanitizePost;
//# sourceMappingURL=middleware.js.map