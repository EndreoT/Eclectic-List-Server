"use strict";
// // During the test the env variable is set to test
// process.env.NODE_ENV = 'test';
// //Require the dev-dependencies
// const chai = require('chai');
// const server = require('../../server');
// const request = require('supertest');
// const usersSeed = require('../scripts/usersSeed.json');
// const utils = require('../scripts/utils');
// const testUtils = require('./utilsForTests');
// const expect = chai.expect;
// //Our parent block
// describe('User', () => {
//   beforeEach(async () => { // Before each test we empty the database
//     // Seed DB with users
//     await utils.dropAllCollections();
//     this.newUserRes = await request(server)
//       .post('/auth/signup')
//       .send(testUtils.user);
//   });
//   after(async () => {
//     await utils.dropAllCollections();
//   });
//   describe('/GET /api/users', () => {
//     it('it should GET all the users', async () => {
//       // Add all users
//       await testUtils.seedUsers(usersSeed);
//       const res = await request(server).get('/api/users');
//       expect(res.status).to.equal(200);
//       expect(res.body).to.be.a('array');
//       expect(res.body.length).to.equal(6 + 1);
//     });
//   });
//   describe('GET /api/users/:id', () => {
//     it('it should GET a User by the given id', async () => {
//       const res = await request(server).get(`/api/users/${this.newUserRes.body.user._id}`);
//       expect(res.status).to.equal(200);
//       expect(res.body).to.have.property('first_name');
//       expect(res.body).to.have.property('last_name');
//       expect(res.body).to.have.property('email');
//       // expect(res.body).to.have.property('picture');
//       expect(res.body).to.have.property('_id', this.newUserRes.body.user._id.toString());
//     });
//     it('it should raise a 422 error with an invalid user id', async () => {
//       const res = await request(server).get('/api/users/1');
//       expect(res.status).to.equal(422);
//     });
//     it('it should return null if user is not found with a valid user id', async () => {
//       const res = await request(server).get('/api/users/111111111111111111111111');
//       expect(res.status).to.equal(200);
//       expect(res.body).to.be.null;
//     });
//   });
//   describe('PUT /:id', () => {
//     it('should update the existing user email and return 200 status only with validated credentials', async () => {
//       const authRes = await request(server)
//         .put('/api/users/' + this.newUserRes.body.user._id)
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({
//           email: 'newemail@gmail.com',
//         });
//       expect(authRes.status).to.equal(200);
//       expect(authRes.body).to.have.property('email', 'newemail@gmail.com');
//       expect(authRes.body._id).to.equal(this.newUserRes.body.user._id);
//     });
//     it('should NOT update the existing user email and return 422 status only with invalid credentials', async () => {
//       const otherUser = await request(server)
//         .post('/auth/signup')
//         .send({
//           first_name: 'first',
//           last_name: 'last',
//           password: '1234',
//           email: 'otheruser@email.com'
//         });
//       const authRes = await request(server)
//         .put('/api/users/' + otherUser.body.user._id)
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({
//           email: 'newemail@gmail.com',
//         });
//       expect(authRes.status).to.equal(422);
//       expect(authRes.body).to.have.property('message', 'You are not authorized to perform this action');
//     });
//   });
//   describe('DELETE /:id', () => {
//     it('should delete requested id and return response 200 only with validated credentials', async () => {
//       const res = await request(server)
//         .delete('/api/users/' + this.newUserRes.body.user._id)
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token);
//       expect(res.status).to.be.equal(200);
//     });
//     it('should NOT delete requested id and return 422 status only with invalid credentials', async () => {
//       const otherUserRes = await request(server)
//         .post('/auth/signup')
//         .send({
//           first_name: 'first',
//           last_name: 'last',
//           password: '1234',
//           email: 'otheruser@email.com'
//         });
//       const authRes = await request(server)
//         .delete('/api/users/' + otherUserRes.body.user._id)
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token);
//       expect(authRes.status).to.equal(422);
//       expect(authRes.body).to.have.property('message', 'You are not authorized to perform this action');
//     });
//     it('should NOT delete an invalid requested id and return 422 status only with invalid credentials', async () => {
//       const deleteRes = await request(server)
//         .delete('/api/users/111111111111111111111111')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token);
//       expect(deleteRes.status).to.be.equal(422);
//       expect(deleteRes.body).to.have.property('message', 'You are not authorized to perform this action');
//     });
//   });
// });
//# sourceMappingURL=testUser.js.map