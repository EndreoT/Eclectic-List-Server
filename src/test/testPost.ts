// // During the test the env variable is set to test
// process.env.NODE_ENV = 'test';

// //Require the dev-dependencies
// const chai = require('chai');
// const server = require('../../server');
// const request = require('supertest');
// const db = require('../models');
// const usersSeed = require('../scripts/usersSeed.json');
// const eventsSeed = require('../scripts/eventsSeed.json');
// const testUtils = require('./utilsForTests');
// const utils = require('../scripts/utils');

// const expect = chai.expect;


// createEvent = async (body) => {
//   const event = await db.Event.create(body);
//   await db.UserEvent.create({ user_id: event.creator, event_id: event._id });
// };

// //Our parent block
// describe('Event', () => {

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

//   describe('/GET /api/events', () => {

//     it('it should GET all the events', async () => {

//       // Add all users
//       await testUtils.seedUsers(usersSeed);

//       const savedUsers = await db.User.find();

//       // Add all events
//       await utils.asyncForEach(eventsSeed, async (item, index) => {
//         const user = savedUsers[index];
//         const event = item;
//         event.creator = user._id;
//         try {
//           await createEvent(event);
//         } catch (err) {
//           console.log(err);
//         }
//       });

//       const res = await request(server).get('/api/events');
//       expect(res.status).to.equal(200);
//       expect(res.body).to.be.a('array');
//       expect(res.body.length).to.equal(6);
//     });
//   });

//   describe('GET /api/events/:id', () => {

//     it('it should GET an Event by the given id', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();
//       const savedEvent = await db.Event.create(testUtils.event);
//       const res = await request(server).get(`/api/events/${savedEvent._id.toString()}`);

//       expect(res.status).to.equal(200);
//       expect(res.body).to.have.property('description');
//       expect(res.body).to.have.property('title');
//       expect(res.body).to.have.property('_id', savedEvent._id.toString());
//     });

//     it('it should raise a 422 error with an invalid event id', async () => {
//       const res = await request(server).get('/api/events/1');
//       expect(res.status).to.equal(422);
//     });

//     it('it should return null if event is not found with a valid event id', async () => {
//       const res = await request(server).get('/api/events/111111111111111111111111');
//       expect(res.status).to.equal(200);
//     });
//   });

//   describe('POST /api/events', async () => {

//     it('should return event when the all request body is valid and user in authenticated', async () => {

//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const res = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);

//       expect(res.status).to.equal(200);
//       expect(res.body).to.have.property('creator', this.newUserRes.body.user._id.toString());
//       expect(res.body).to.have.property('title', testUtils.event.title);
//     });

//     it('should not create a Event document if user does not exist', async () => {
//       testUtils.event.creator = '111111111111111111111111';
//       const res = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkNGRhY2JlNTViNmQxMDVlMDJhMWI1NSIsImZpcnN0X25hbWUiOiJhc2RmIiwiZW1haWwiOiJkZGZAYWEuY29tIn0sImlhdCI6MTU2NTM3MTU4MiwiZXhwIjoxNTY1OTc2MzgyfQ.D2Wslrl0KO-byZnrvjjfyJicRpNBw-DtT5Tiek-Nih8')
//         .send(testUtils.event);
//       expect(res.status).to.be.eql(401);
//       expect(res.body).to.have.property('message', 'The user in the token was not found');
//     });

//     it('should create a UserEvent document after the event is created successfully', async () => {

//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const eventRes = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);

//       const userEventRes = await request(server)
//         .get(`/api/userEvents/${this.newUserRes.body.user._id.toString()}/${eventRes.body._id}`)
//         .send(testUtils.event);
//       expect(userEventRes.body.user_id).to.equal(this.newUserRes.body.user._id.toString());
//       expect(userEventRes.body.event_id).to.equal(eventRes.body._id.toString());
//     });
//   });

//   describe('PUT /:id', () => {
//     it('should update the existing event and return 200 only with validated credentials', async () => {

//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const newEvent = new db.Event(testUtils.event);
//       await newEvent.save();

//       const res = await request(server)
//         .put('/api/events/' + newEvent._id)
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({
//           description: 'descTest',
//           title: 'titleTest',
//         });
//       expect(res.status).to.equal(200);
//       expect(res.body).to.have.property('description', 'descTest');
//       expect(res.body.creator).to.equal(this.newUserRes.body.user._id.toString());
//     });

//     it('should NOT update the existing event and return 422 only with invalid credentials', async () => {

//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const otherUser = await request(server)
//         .post('/auth/signup')
//         .send({
//           first_name: 'first',
//           last_name: 'last',
//           password: '1234',
//           email: 'otheruser@email.com'
//         });

//       const newEvent = new db.Event(testUtils.event);
//       await newEvent.save();

//       const res = await request(server)
//         .put('/api/events/' + newEvent._id)
//         .set('Authorization', 'bearer ' + otherUser.body.token)
//         .send({
//           description: 'descTest',
//           title: 'titleTest',
//         });
//       expect(res.status).to.equal(422);
//       expect(res.body).to.have.property('message', 'You are not authorized to perform this action');
//     });
//   });

//   describe('DELETE /:id', () => {

//     it('should delete requested id and return response 200 only with validated credentials', async () => {

//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const eventRes = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);

//       const deleteRes = await request(server)
//         .delete('/api/events/' + eventRes.body._id)
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token);
//       expect(deleteRes.status).to.be.equal(200);
//     });

//     it('should NOT delete requested id and return response 404 only with invalid credentials', async () => {

//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const eventRes = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);

//       const otherUser = await request(server)
//         .post('/auth/signup')
//         .send({
//           first_name: 'first',
//           last_name: 'last',
//           password: '1234',
//           email: 'otheruser@email.com'
//         });

//       const deleteRes = await request(server)
//         .delete('/api/events/' + eventRes.body._id)
//         .set('Authorization', 'bearer ' + otherUser.body.token);
//       expect(deleteRes.status).to.be.equal(422);
//       expect(deleteRes.body).to.have.property('message', 'You are not authorized to perform this action');
//     });

//     it('should delete requested id, delete all UserEvent documents with field event_id === id, and return response 200', async () => {

//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const eventRes = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);

//       await request(server)
//         .delete('/api/events/' + eventRes.body._id)
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token);

//       const founduserEvents = await db.UserEvent.find({ event_id: eventRes.body._id });
//       expect(founduserEvents.length).to.be.equal(0);
//     });

//     it('should raise 422 when deleted event id is not a valid _id', async () => {

//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);

//       const deleteRes = await request(server)
//         .delete('/api/events/1')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token);

//       expect(deleteRes.status).to.be.equal(404);
//       expect(deleteRes.body).to.have.property('message');
//     });

//     it('should return null when deleted event does not exist', async () => {

//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);

//       const deleteRes = await request(server)
//         .delete('/api/events/111111111111111111111111')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token);

//       expect(deleteRes.status).to.be.equal(404);
//     });
//   });
// });