"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_1 = require("express-validator/filter");
function sanitizePost(req, res, next) {
    filter_1.sanitizeBody("subject").trim().escape();
    filter_1.sanitizeBody("description").trim().escape();
    filter_1.sanitizeBody("price").toFloat().trim().escape();
    return next();
}
exports.sanitizePost = sanitizePost;
function sanitizeComment(req, res, next) {
    filter_1.sanitizeBody("comment").trim().escape();
    next();
}
exports.sanitizeComment = sanitizeComment;
//# sourceMappingURL=middleware.js.map