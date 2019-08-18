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
    // describe('POST /auth/login', () => {
    //   it('should return user and token when the email and password are valid', async () => {
    //     await db.User.create(utils.user);
    //     const res = await request(server)
    //       .post('/auth/login')
    //       .send({ email: utils.user.email, password: utils.user.password });
    //     expect(res.status).to.equal(200);
    //     const user = res.body.user;
    //     expect(user).to.have.property('email', utils.user.email);
    //     expect(user).to.have.property('first_name', utils.user.first_name);
    //     expect(res.body).to.have.property('token');
    //   });
    //   it('should not return user and token when the email is valid, but the password is not valid', async () => {
    //     await db.User.create(utils.user);
    //     const res = await request(server)
    //       .post('/auth/login')
    //       .send({ email: utils.user.email, password: '12345' });
    //     expect(res.status).to.equal(401);
    //     expect(res.body).to.have.property('message');
    //   });
    //   it('should not return user and token when the email is not valid', async () => {
    //     await db.User.create(utils.user);
    //     const res = await request(server)
    //       .post('/auth/login')
    //       .send({ email: 'notanemail@email.com', password: '1234' });
    //     expect(res.status).to.equal(401);
    //     expect(res.body).to.have.property('message');
    //   });
    //   it('should not return user and token when credentials are not provided', async () => {
    //     await db.User.create(utils.user);
    //     const res = await request(server)
    //       .post('/auth/login')
    //       .send();
    //     expect(res.status).to.equal(401);
    //     expect(res.body).to.have.property('message');
    //   });
    // });
    // describe('GET /auth/protected/:id', () => {
    //   it('should access protected route with validated credentials', async () => {
    //     const newUser = await request(server)
    //       .post('/auth/signup')
    //       .send(utils.user);
    //     const authRes = await request(server)
    //       .get('/auth/protected/' + newUser.body.user._id)
    //       .set('Authorization', 'bearer ' + newUser.body.token);
    //     expect(authRes.body).to.have.property('message', 'I\'m protected!');
    //   });
    //   it('should not access a protected route with invalidated credentials', async () => {
    //     const newUser = await request(server)
    //       .post('/auth/signup')
    //       .send(utils.user);
    //     const otherUser = await request(server)
    //       .post('/auth/signup')
    //       .send({
    //         first_name: 'first',
    //         last_name: 'last',
    //         password: '1234',
    //         email: 'otheruser@email.com'
    //       });
    //     const authRes = await request(server)
    //       .get('/auth/protected/' + newUser.body.user._id)
    //       .set('Authorization', 'bearer ' + otherUser.body.token);
    //     expect(authRes.body).to.have.property('message', 'You are not authorized to perform this action');
    //   });
    //   it('should not access a protected route with a valid JWT but no user in DB', async () => {
    //     const newUser = await request(server)
    //       .post('/auth/signup')
    //       .send(utils.user);
    //     const authRes = await request(server)
    //       .get('/auth/protected/' + newUser.body.user._id)
    //       .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkNGRhY2JlNTViNmQxMDVlMDJhMWI1NSIsImZpcnN0X25hbWUiOiJhc2RmIiwiZW1haWwiOiJkZGZAYWEuY29tIn0sImlhdCI6MTU2NTM3MTU4MiwiZXhwIjoxNTY1OTc2MzgyfQ.D2Wslrl0KO-byZnrvjjfyJicRpNBw-DtT5Tiek-Nih8');
    //     expect(authRes.body).to.have.property('message', 'The user in the token was not found');
    //   });
    //   it('should not access a protected route with an invalid JWT', async () => {
    //     const newUser = await request(server)
    //       .post('/auth/signup')
    //       .send(utils.user);
    //     const authRes = await request(server)
    //       .get('/auth/protected/' + newUser.body.user._id)
    //       .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkNGRhY2JlNTViNmQxMDVlMDJhMWI1NSIsImZpcnN0X25hbWUi8iJhc2RmIiwiZW1haWwiOiJkZGZAYWEuY29tin0sImlhdCI6MTU2NTM3MTU4MiwiZXhwIjoxNTY1OTc2MzgyfQ.D2Wslrl0KO-byZnrvjjfyJicRpNBw-dtT5Tiek-Niha');
    //     expect(authRes.body.message.slice(0, 16)).to.equal('Unexpected token');
    //   });
    //   it('should not access a protected route with no JWT provided', async () => {
    //     const newUser = await request(server)
    //       .post('/auth/signup')
    //       .send(utils.user);
    //     const authRes = await request(server)
    //       .get('/auth/protected/' + newUser.body.user._id);
    //     expect(authRes.body.message).to.equal('No auth token');
    //   });
    // });
});
//# sourceMappingURL=testAuth.js.map