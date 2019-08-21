"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Require the dev-dependencies
const chai_1 = require("chai");
const request = require("supertest");
const utilsForTests_1 = require("./utilsForTests");
const init_1 = require("./init");
;
//Our parent block
describe('Comment', () => {
    beforeEach(async () => {
        await utilsForTests_1.utils.dropAllCollections();
    });
    after(async () => {
        await utilsForTests_1.utils.dropAllCollections();
    });
    describe('POST /api/comments', async () => {
        it('should return comment when the all request body is valid and user in authenticated', async () => {
            const userRes = await request(init_1.expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const postRes = await request(init_1.expressServer)
                .post('/api/posts')
                .set('Authorization', 'bearer ' + userRes.body.token)
                .send(utilsForTests_1.utils.post);
            const commentRes = await request(init_1.expressServer)
                .post('/api/comments')
                .set('Authorization', 'bearer ' + userRes.body.token)
                .send({
                postId: postRes.body._id,
                comment: 'Hello'
            });
            chai_1.expect(commentRes.status).to.equal(200);
            chai_1.expect(commentRes.body.user).to.have.property('_id', userRes.body.user._id.toString());
            chai_1.expect(commentRes.body).to.have.property('post', postRes.body._id.toString());
        });
        it('should NOT return comment when the jwt is malformed', async () => {
            const userRes = await request(init_1.expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const postRes = await request(init_1.expressServer)
                .post('/api/posts')
                .set('Authorization', 'bearer ' + userRes.body.token)
                .send(utilsForTests_1.utils.post);
            const commentRes = await request(init_1.expressServer)
                .post('/api/comments')
                .set('Authorization', 'bearer ' + '1234')
                .send({
                postId: postRes.body._id,
                comment: 'Hello'
            });
            chai_1.expect(commentRes.status).to.equal(401);
            chai_1.expect(commentRes.body).to.have.property('message', 'jwt malformed');
        });
        it('should NOT return comment when the user does not exist', async () => {
            const userRes = await request(init_1.expressServer)
                .post('/auth/signup')
                .send(utilsForTests_1.utils.user);
            const postRes = await request(init_1.expressServer)
                .post('/api/posts')
                .set('Authorization', 'bearer ' + userRes.body.token)
                .send(utilsForTests_1.utils.post);
            const commentRes = await request(init_1.expressServer)
                .post('/api/comments')
                .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkNTk4ZTc1ZDkxZWYyNGZmNDQ2MjgyYiIsInVzZXJuYW1lIjoiZmlyc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIn0sImlhdCI6MTU2NjE1MDI2MSwiZXhwIjoxNTY2NzU1MDYxfQ.qIa8bHd7-JVSkuDozSksN6XJfikB6DBhggtL5coD9EE')
                .send({
                postId: postRes.body._id,
                comment: 'Hello'
            });
            chai_1.expect(commentRes.status).to.equal(401);
            chai_1.expect(commentRes.body).to.have.property('message', 'The user in the token was not found');
        });
        it('should NOT create a comment if the event does not exist', async () => {
            it('should return comment when the all request body is valid and user in authenticated', async () => {
                const userRes = await request(init_1.expressServer)
                    .post('/auth/signup')
                    .send(utilsForTests_1.utils.user);
                const commentRes = await request(init_1.expressServer)
                    .post('/api/comments')
                    .set('Authorization', 'bearer ' + userRes.body.token)
                    .send({
                    postId: '111111111111111111111111',
                    comment: 'Hello'
                });
                chai_1.expect(commentRes.status).to.equal(404);
                chai_1.expect(commentRes.body).to.have.property('message', 'Event does not exist');
            });
        });
    });
    // describe('PUT /api/comments/:id', async () => {
    //   it('should update the comment body with valid credentials', async () => {
    //     const eventRes = await request(expressServer)
    //       .post('/api/events')
    //       .set('Authorization', 'bearer ' + userRes.body.token)
    //       .send(testUtils.event);
    //     const commentRes = await request(expressServer)
    //       .post('/api/comments')
    //       .set('Authorization', 'bearer ' + userRes.body.token)
    //       .send({
    //         eventId: eventRes.body._id,
    //         body: 'Hello'
    //       });
    //     const updateRes = await request(expressServer)
    //       .put(`/api/comments/${commentRes.body._id}`)
    //       .set('Authorization', 'bearer ' + userRes.body.token)
    //       .send({
    //         body: 'Updated hello'
    //       });
    //     expect(updateRes.status).to.equal(200);
    //     expect(updateRes.body).to.have.property('_id', commentRes.body._id);
    //     expect(updateRes.body).to.have.property('creator', this.newUserRes.body.user._id.toString());
    //     expect(updateRes.body).to.have.property('event', eventRes.body._id);
    //     expect(updateRes.body).to.have.property('body', 'Updated hello');
    //   });
    // });
    // describe('DELETE /api/comments/:id', async () => {
    //   it('should delete the comment with valid credentials', async () => {
    //     const eventRes = await request(expressServer)
    //       .post('/api/events')
    //       .set('Authorization', 'bearer ' + userRes.body.token)
    //       .send(testUtils.event);
    //     const commentRes = await request(expressServer)
    //       .post('/api/comments')
    //       .set('Authorization', 'bearer ' + userRes.body.token)
    //       .send({
    //         eventId: eventRes.body._id,
    //         body: 'Hello'
    //       });
    //     const deleteRes = await request(expressServer)
    //       .delete(`/api/comments/${commentRes.body._id}`)
    //       .set('Authorization', 'bearer ' + userRes.body.token);
    //     expect(deleteRes.status).to.equal(200);
    //   });
    //   it('should NOT delete the comment with invalid credentials', async () => {
    //     const eventRes = await request(expressServer)
    //       .post('/api/events')
    //       .set('Authorization', 'bearer ' + userRes.body.token)
    //       .send(testUtils.event);
    //     const commentRes = await request(expressServer)
    //       .post('/api/comments')
    //       .set('Authorization', 'bearer ' + userRes.body.token)
    //       .send({
    //         eventId: eventRes.body._id,
    //         body: 'Hello'
    //       });
    //     const otherUser = await request(expressServer)
    //       .post('/auth/signup')
    //       .send({
    //         first_name: 'first',
    //         last_name: 'last',
    //         password: '1234',
    //         email: 'otheruser@email.com'
    //       });
    //     const deleteRes = await request(expressServer)
    //       .delete(`/api/comments/${commentRes.body._id}`)
    //       .set('Authorization', 'bearer ' + otherUser.body.token);
    //     expect(deleteRes.status).to.equal(422);
    //     expect(deleteRes.body).to.have.property('message', 'You are not authorized to perform this action');
    //   });
    // });
});
//# sourceMappingURL=testComment.js.map