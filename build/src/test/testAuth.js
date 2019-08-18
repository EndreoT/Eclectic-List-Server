"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
//Require the dev-dependencies
const chai_1 = require("chai");
const request = require("supertest");
const app_1 = require("../app");
const models_1 = require("../models");
const utilsForTests_1 = require("./utilsForTests");
const application = new app_1.default();
application.initExpressConnection();
const expressServer = application.getExpressServer();
//Our parent block
describe('Authentication', () => {
    beforeEach(async () => {
        // Seed DB with users
        await utilsForTests_1.utils.dropAllCollections();
        await models_1.db.Image.create({ path: '1234', public_id: '1234', folder: 'avatar', caption: 'default' });
    });
    after(async () => {
        await utilsForTests_1.utils.dropAllCollections();
    });
    describe('POST /auth/signup', () => {
        it('should return user and token when the all request body is valid', async () => {
            const res = await request(expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            chai_1.expect(res.status).to.equal(200);
            const user = res.body.user;
            chai_1.expect(user).to.have.property('email', utilsForTests_1.utils.user.email);
            chai_1.expect(user).to.have.property('username', utilsForTests_1.utils.user.username);
            chai_1.expect(res.body).to.have.property('token');
        });
    });
    describe('POST /auth/login', () => {
        it('should return user and token when the email and password are valid', async () => {
            await request(expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const res = await request(expressServer)
                .post('/auth/login')
                .send({ email: utilsForTests_1.utils.user.email, password: utilsForTests_1.utils.user.password });
            chai_1.expect(res.status).to.equal(200);
            const user = res.body.user;
            chai_1.expect(user).to.have.property('email', utilsForTests_1.utils.user.email);
            chai_1.expect(user).to.have.property('username', utilsForTests_1.utils.user.username);
            chai_1.expect(res.body).to.have.property('token');
        });
        it('should NOT return user and token when the email is valid, but the password is not valid', async () => {
            await request(expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const res = await request(expressServer)
                .post('/auth/login')
                .send({ email: utilsForTests_1.utils.user.email, password: 'asdfg' });
            chai_1.expect(res.status).to.equal(401);
            chai_1.expect(res.body).to.have.property('message');
        });
        it('should NOT return user and token when the email is not valid', async () => {
            await request(expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const res = await request(expressServer)
                .post('/auth/login')
                .send({ email: 'notanemail@email.com', password: 'asdfg' });
            chai_1.expect(res.status).to.equal(401);
            chai_1.expect(res.body).to.have.property('message');
        });
        it('should NOT return user and token when credentials are not provided', async () => {
            await request(expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const res = await request(expressServer)
                .post('/auth/login')
                .send();
            chai_1.expect(res.status).to.equal(400);
            chai_1.expect(res.body).to.have.property('message');
        });
    });
    describe('GET /auth/protected/:id', () => {
        it('should access protected route with validated credentials', async () => {
            const newUser = await request(expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const authRes = await request(expressServer)
                .get('/auth/protected/' + newUser.body.user._id)
                .set('Authorization', 'bearer ' + newUser.body.token);
            chai_1.expect(authRes.body).to.have.property('message', 'I\'m protected!');
        });
        it('should NOT access a protected route with invalidated credentials', async () => {
            const newUser = await request(expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const otherUser = await request(expressServer)
                .post('/auth/signup')
                .send({
                username: 'username',
                password: '1234afds',
                email: 'otheruser@email.com'
            });
            const authRes = await request(expressServer)
                .get('/auth/protected/' + newUser.body.user._id)
                .set('Authorization', 'bearer ' + otherUser.body.token);
            chai_1.expect(authRes.body).to.have.property('message', 'You are not authorized to perform this action');
        });
        it('should NOT access a protected route with a valid JWT but no user in DB', async () => {
            const newUser = await request(expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const authRes = await request(expressServer)
                .get('/auth/protected/' + newUser.body.user._id)
                .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkNTk4ZTc1ZDkxZWYyNGZmNDQ2MjgyYiIsInVzZXJuYW1lIjoiZmlyc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIn0sImlhdCI6MTU2NjE1MDI2MSwiZXhwIjoxNTY2NzU1MDYxfQ.qIa8bHd7-JVSkuDozSksN6XJfikB6DBhggtL5coD9EE');
            chai_1.expect(authRes.body).to.have.property('message', 'The user in the token was not found');
        });
        it('should NOT access a protected route with an invalid JWT', async () => {
            const newUser = await request(expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const authRes = await request(expressServer)
                .get('/auth/protected/' + newUser.body.user._id)
                .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkNTk4ZTc1ZDkxZWYyNGZmNDQ2MjgyYiIsInVzZXJuYW1lIjoiZmlyc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIn0sImlhdCI6MTU2NjE1MDI2MSwiZXhwIjoxNTY2NzU1MDYxfQ.qIa8bHd7-JVSkuDozSksN6XJfikB6DBhggtL5coD9Ex');
            chai_1.expect(authRes.body.message.slice(0, 17)).to.equal('invalid signature');
        });
        it('should NOT access a protected route with no JWT provided', async () => {
            const newUser = await request(expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const authRes = await request(expressServer)
                .get('/auth/protected/' + newUser.body.user._id);
            chai_1.expect(authRes.body.message).to.equal('No auth token');
        });
    });
});
//# sourceMappingURL=testAuth.js.map