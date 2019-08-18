"use strict";
// // During the test the env variable is set to test
// process.env.NODE_ENV = 'test';
// //Require the dev-dependencies
// const chai = require('chai');
// const server = require('../../server');
// const request = require('supertest');
// const db = require('../models');
// const testUtils = require('./utilsForTests');
// const utils = require('../scripts/utils');
// const expect = chai.expect;
// createEvent = async (body) => {
//   const event = await db.Event.create(body);
//   await db.UserEvent.create({ user_id: event.creator, event_id: event._id });
// };
// //Our parent block
// describe('Comment', () => {
//   beforeEach(async () => { // Before each test we empty the database
//     // Seed DB with users
//     await utils.dropAllCollections();
//     // Create a new user
//     this.newUserRes = await request(server)
//       .post('/auth/signup')
//       .send(testUtils.user);
//   });
//   after(async () => {
//     await utils.dropAllCollections();
//   });
//   describe('GET /api/comments/event/:eventId', () => {
//     it('should return comment when the all request body is valid and user in authenticated', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();
//       const eventRes = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);
//       await request(server)
//         .post('/api/comments')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({
//           eventId: eventRes.body._id,
//           body: 'Hello'
//         });
//       const foundCommentsRes = await request(server)
//         .get(`/api/comments/event/${eventRes.body._id}`);
//       expect(foundCommentsRes.status).to.equal(200);
//       expect(foundCommentsRes.body.length).to.equal(1);
//     });
//   });
//   describe('POST /api/comments', async () => {
//     it('should return comment when the all request body is valid and user in authenticated', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();
//       const eventRes = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);
//       const commentRes = await request(server)
//         .post('/api/comments')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({
//           eventId: eventRes.body._id,
//           body: 'Hello'
//         });
//       expect(commentRes.status).to.equal(200);
//       expect(commentRes.body.creator).to.have.property('_id', this.newUserRes.body.user._id.toString());
//       expect(commentRes.body).to.have.property('event', eventRes.body._id.toString());
//     });
//     it('should NOT create a comment with invalid credentials', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();
//       const eventRes = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);
//       const commentRes = await request(server)
//         .post('/api/comments')
//         .set('Authorization', 'bearer ' + '1234')
//         .send({
//           eventId: eventRes.body._id,
//           body: 'Hello'
//         });
//       expect(commentRes.status).to.equal(401);
//       expect(commentRes.body).to.have.property('message', 'jwt malformed');
//     });
//     it('should NOT create a comment if the user does not exist', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();
//       const eventRes = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);
//       const commentRes = await request(server)
//         .post('/api/comments')
//         .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkNGRhYzFmMDUzN2JjMjc0YzEzMzIxMCIsImZpcnN0X25hbWUiOiJCaWxseSIsImVtYWlsIjoiYmlsbHlib2JAZ21haWwuY29tIn0sImlhdCI6MTU2NTQ1ODMzNywiZXhwIjoxNTY2MDYzMTM3fQ.ows6wxM-a4XsnYiUABBw7eFIUH8WjhJNJ_S8wenjDZc')
//         .send({
//           eventId: eventRes.body._id,
//           body: 'Hello'
//         });
//       expect(commentRes.status).to.equal(401);
//       expect(commentRes.body).to.have.property('message', 'The user in the token was not found');
//     });
//     it('should NOT create a comment if the event does not exist', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();
//       const commentRes = await request(server)
//         .post('/api/comments')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({
//           eventId: '111111111111111111111111',
//           body: 'Hello'
//         });
//       expect(commentRes.status).to.equal(404);
//       expect(commentRes.body).to.have.property('message', 'Event does not exist');
//     });
//   });
//   describe('PUT /api/comments/:id', async () => {
//     it('should update the comment body with valid credentials', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();
//       const eventRes = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);
//       const commentRes = await request(server)
//         .post('/api/comments')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({
//           eventId: eventRes.body._id,
//           body: 'Hello'
//         });
//       const updateRes = await request(server)
//         .put(`/api/comments/${commentRes.body._id}`)
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({
//           body: 'Updated hello'
//         });
//       expect(updateRes.status).to.equal(200);
//       expect(updateRes.body).to.have.property('_id', commentRes.body._id);
//       expect(updateRes.body).to.have.property('creator', this.newUserRes.body.user._id.toString());
//       expect(updateRes.body).to.have.property('event', eventRes.body._id);
//       expect(updateRes.body).to.have.property('body', 'Updated hello');
//     });
//   });
//   describe('DELETE /api/comments/:id', async () => {
//     it('should delete the comment with valid credentials', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();
//       const eventRes = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);
//       const commentRes = await request(server)
//         .post('/api/comments')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({
//           eventId: eventRes.body._id,
//           body: 'Hello'
//         });
//       const deleteRes = await request(server)
//         .delete(`/api/comments/${commentRes.body._id}`)
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token);
//       expect(deleteRes.status).to.equal(200);
//     });
//     it('should NOT delete the comment with invalid credentials', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();
//       const eventRes = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);
//       const commentRes = await request(server)
//         .post('/api/comments')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({
//           eventId: eventRes.body._id,
//           body: 'Hello'
//         });
//       const otherUser = await request(server)
//         .post('/auth/signup')
//         .send({
//           first_name: 'first',
//           last_name: 'last',
//           password: '1234',
//           email: 'otheruser@email.com'
//         });
//       const deleteRes = await request(server)
//         .delete(`/api/comments/${commentRes.body._id}`)
//         .set('Authorization', 'bearer ' + otherUser.body.token);
//       expect(deleteRes.status).to.equal(422);
//       expect(deleteRes.body).to.have.property('message', 'You are not authorized to perform this action');
//     });
//   });
// });
//# sourceMappingURL=testComment.js.map