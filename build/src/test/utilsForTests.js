"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const asyncForEach = require('../scripts/utils').asyncForEach;
const models_1 = require("../models");
exports.utils = {
    post: {
        subject: 'Test title',
        description: 'Test Description',
        price: 0,
        category: 'antiques',
    },
    user: {
        username: 'testuser',
        password: '12345',
        email: 'user@email.com'
    },
    async dropAllCollections() {
        await models_1.db.User.remove({});
        await models_1.db.Post.remove({});
        await models_1.db.Comment.remove({});
    },
};
//# sourceMappingURL=utilsForTests.js.map