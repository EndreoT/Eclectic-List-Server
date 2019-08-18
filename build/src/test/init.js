"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const app_1 = require("../app");
const models_1 = require("../models");
const utilsForTests_1 = require("./utilsForTests");
const application = new app_1.default();
application.initExpressConnection();
before(async () => {
    await models_1.db.Image.create({ path: '1234', public_id: '1234', folder: 'avatar', caption: 'default' });
});
after(async () => {
    await utilsForTests_1.utils.dropAllCollections();
    await models_1.db.Image.remove({});
});
exports.expressServer = application.getExpressServer();
//# sourceMappingURL=init.js.map