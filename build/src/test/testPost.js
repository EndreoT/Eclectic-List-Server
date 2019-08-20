"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Require the dev-dependencies
const chai_1 = require("chai");
const request = require("supertest");
const utilsForTests_1 = require("./utilsForTests");
const init_1 = require("./init");
;
//Our parent block
describe('Post', () => {
    beforeEach(async () => {
        // Before each test we empty the database
        await utilsForTests_1.utils.dropAllCollections();
    });
    after(async () => {
        await utilsForTests_1.utils.dropAllCollections();
    });
    describe('GET api/posts/postsByUser/:user', () => {
        it('it should GET all posts created by a given user', async () => {
            const userRes = await request(init_1.expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            await request(init_1.expressServer)
                .post('/api/posts')
                .set('Authorization', 'bearer ' + userRes.body.token)
                .send(utilsForTests_1.utils.post);
            const postsRes = await request(init_1.expressServer).get(`/api/posts/postsByUser/${userRes.body.user.username}`);
            chai_1.expect(postsRes.status).to.equal(200);
            chai_1.expect(postsRes.body.length).to.equal(1);
        });
    });
    describe('POST /api/posts', async () => {
        it('should return event when the all request body is valid and user in authenticated', async () => {
            const userRes = await request(init_1.expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const postRes = await request(init_1.expressServer)
                .post('/api/posts')
                .set('Authorization', 'bearer ' + userRes.body.token)
                .send(utilsForTests_1.utils.post);
            chai_1.expect(postRes.status).to.equal(200);
            chai_1.expect(postRes.body).to.have.property('user', userRes.body.user._id.toString());
            chai_1.expect(postRes.body).to.have.property('subject', utilsForTests_1.utils.post.subject);
        });
        it('should not create a Event document if user does not exist', async () => {
            const postRes = await request(init_1.expressServer)
                .post('/api/posts')
                .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkNTk4ZTc1ZDkxZWYyNGZmNDQ2MjgyYiIsInVzZXJuYW1lIjoiZmlyc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIn0sImlhdCI6MTU2NjE1MDI2MSwiZXhwIjoxNTY2NzU1MDYxfQ.qIa8bHd7-JVSkuDozSksN6XJfikB6DBhggtL5coD9EE')
                .send(utilsForTests_1.utils.post);
            chai_1.expect(postRes.status).to.be.eql(401);
            chai_1.expect(postRes.body).to.have.property('message', 'The user in the token was not found');
        });
    });
    describe('PUT /:id', () => {
        it('should update the existing event and return 200 only with validated credentials', async () => {
            const userRes = await request(init_1.expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const postRes = await request(init_1.expressServer)
                .post('/api/posts')
                .set('Authorization', 'bearer ' + userRes.body.token)
                .send(utilsForTests_1.utils.post);
            const updateRes = await request(init_1.expressServer)
                .put('/api/posts/' + postRes.body._id)
                .set('Authorization', 'bearer ' + userRes.body.token)
                .send({
                subject: 'testSubject',
                description: 'testDesc',
                price: 2,
                category: 'appliances',
            });
            chai_1.expect(updateRes.status).to.equal(200);
            chai_1.expect(updateRes.body).to.have.property('subject', 'testSubject');
            chai_1.expect(updateRes.body).to.have.property('price', 2.0);
            chai_1.expect(updateRes.body).to.have.property('description', 'testDesc');
            chai_1.expect(updateRes.body.user).to.equal(userRes.body.user._id.toString());
        });
        it('should NOT update the existing event and return 422 only with invalid credentials', async () => {
            const userRes = await request(init_1.expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const postRes = await request(init_1.expressServer)
                .post('/api/posts')
                .set('Authorization', 'bearer ' + userRes.body.token)
                .send(utilsForTests_1.utils.post);
            const otherUser = await request(init_1.expressServer)
                .post('/auth/signup')
                .send({
                username: 'otherUsername',
                password: '1234asdf',
                email: 'otheruser@email.com'
            });
            const updateRes = await request(init_1.expressServer)
                .put('/api/posts/' + postRes.body._id)
                .set('Authorization', 'bearer ' + otherUser.body.token)
                .send({
                subject: 'testSubject',
                description: 'testDesc',
                price: 2,
                category: 'appliances',
            });
            chai_1.expect(updateRes.status).to.equal(422);
            chai_1.expect(updateRes.body).to.have.property('message', 'You are not authorized to perform this action');
        });
    });
    describe('DELETE /:id', () => {
        it('should delete requested id and return response 200 only with validated credentials', async () => {
            const userRes = await request(init_1.expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const postRes = await request(init_1.expressServer)
                .post('/api/posts')
                .set('Authorization', 'bearer ' + userRes.body.token)
                .send(utilsForTests_1.utils.post);
            const deleteRes = await request(init_1.expressServer)
                .delete('/api/posts/' + postRes.body._id)
                .set('Authorization', 'bearer ' + userRes.body.token);
            chai_1.expect(deleteRes.status).to.be.equal(200);
        });
        it('should NOT delete requested id and return response 404 only with invalid credentials', async () => {
            const userRes = await request(init_1.expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const postRes = await request(init_1.expressServer)
                .post('/api/posts')
                .set('Authorization', 'bearer ' + userRes.body.token)
                .send(utilsForTests_1.utils.post);
            const otherUser = await request(init_1.expressServer)
                .post('/auth/signup')
                .send({
                username: 'otherUsername',
                password: '1234asdf',
                email: 'otheruser@email.com'
            });
            const deleteRes = await request(init_1.expressServer)
                .delete('/api/posts/' + postRes.body._id)
                .set('Authorization', 'bearer ' + otherUser.body.token);
            chai_1.expect(deleteRes.status).to.be.equal(422);
            chai_1.expect(deleteRes.body).to.have.property('message', 'You are not authorized to perform this action');
        });
        it('should NOT delete requested id and return response 404 with a missing JWT', async () => {
            const userRes = await request(init_1.expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const postRes = await request(init_1.expressServer)
                .post('/api/posts')
                .set('Authorization', 'bearer ' + userRes.body.token)
                .send(utilsForTests_1.utils.post);
            const deleteRes = await request(init_1.expressServer)
                .delete('/api/posts/' + postRes.body._id);
            chai_1.expect(deleteRes.status).to.be.equal(401);
            chai_1.expect(deleteRes.body).to.have.property('message', 'No auth token');
        });
    });
});
//# sourceMappingURL=testPost.js.map