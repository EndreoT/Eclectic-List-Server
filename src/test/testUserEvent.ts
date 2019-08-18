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
// describe('UserEvent', () => {

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

//   describe('/GET /api/userEvents', () => {
//     it('it should GET all the UserEvents', async () => {
//       // Add all users
//       await testUtils.seedUsers(usersSeed);

//       const savedUsers = await db.User.find({});

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

//       const res = await request(server).get('/api/userEvents');
//       expect(res.status).to.equal(200);
//       expect(res.body).to.be.a('array');
//       expect(res.body.length).to.equal(6);
//     });
//   });

//   describe('GET /api/userEvent/user/:id', () => {

//     it('it should GET all UserEvent docs for a user id', async () => {

//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const savedEvent = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);

//       // Add user to one more event that is not the event first created
//       const otherEvent = await db.Event.findOne({ _id: { $ne: savedEvent._id } });
//       db.UserEvent.create({ user_id: this.newUserRes.body.user._id.toString(), event_id: otherEvent._id });

//       const res = await request(server).get(`/api/userEvents/user/${this.newUserRes.body.user._id.toString()}`);
//       expect(res.status).to.equal(200);
//       expect(res.body).to.be.a('array');
//       expect(res.body.length).to.equal(2);
//     });

//     it('it should raise a 422 error with an invalid event id', async () => {
//       const res = await request(server).get('/api/userEvents/users/1');
//       expect(res.status).to.equal(422);
//     });

//     it('it should return null if event is not found with a valid event id', async () => {
//       const res = await request(server).get('/api/userEvents/user/111111111111111111111111');
//       expect(res.status).to.equal(200);
//     });
//   });

//   describe('GET /api/userEvent/event/:id', () => {

//     it('it should GET all UserEvent docs for an event id', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const savedEvent = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);

//       // Add another to event that is not the user first created
//       const otherUser = await db.Event.findOne({ _id: { $ne: this.newUserRes.body.user._id.toString() } });
//       db.UserEvent.create({ user_id: otherUser._id.toString(), event_id: savedEvent.body._id });

//       const res = await request(server).get(`/api/userEvents/event/${savedEvent.body._id}`);
//       expect(res.status).to.equal(200);
//       expect(res.body).to.be.a('array');
//       expect(res.body.length).to.equal(2);
//     });

//     it('it should raise a 422 error with an invalid event id', async () => {
//       const res = await request(server).get('/api/userEvents/event/1');
//       expect(res.status).to.equal(422);
//     });

//     it('it should return null if event is not found with a valid event id', async () => {
//       const res = await request(server).get('/api/userEvents/event/111111111111111111111111');
//       expect(res.status).to.equal(200);
//     });
//   });

//   describe('POST /api/userEvents', async () => {

//     it('should return the UserEvent when the all request body is valid', async () => {

//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       // Create event without a UserEvent document
//       const newEvent = await db.Event.create(testUtils.event);

//       // Add user to event
//       const postRes = await request(server)
//         .post('/api/userEvents')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({ event_id: newEvent._id.toString() });

//       expect(postRes.status).to.equal(200);
//       expect(postRes.body.user_id).to.equal(this.newUserRes.body.user._id.toString());
//       expect(postRes.body.event_id).to.equal(newEvent._id.toString());
//     });

//     it('should NOT create the UserEvent with invalid credentials', async () => {

//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       // Create event without a UserEvent document
//       const newEvent = await db.Event.create(testUtils.event);

//       // Add user to event
//       const postRes = await request(server)
//         .post('/api/userEvents')
//         .send({ event_id: newEvent._id.toString() });

//       expect(postRes.status).to.equal(401);
//       expect(postRes.body).to.have.property('message', 'No auth token');
//     });

//     it('should not create a UserEvent document if user is already atttending event', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const savedEvent = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);

//       const res = await request(server)
//         .post('/api/userEvents/')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({ event_id: savedEvent.body._id.toString() });
//       expect(res.status).to.be.eql(400);
//       expect(res.body.message).to.equal('User is already attending event');
//     });

//     it('should not create a UserEvent document if user id is invalid', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const savedEvent = await request(server)
//         .post('/api/events')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send(testUtils.event);

//       const res = await request(server)
//         .post('/api/userEvents')
//         .set('Authorization', 'bearer ' + '1234')
//         .send({ event_id: savedEvent.body._id });

//       expect(res.status).to.be.eql(401);
//       expect(res.body).to.have.property('message');
//       expect(res.body.message).to.equal('jwt malformed');
//     });

//     it('should not create a UserEvent document if event id does not exist', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const res = await request(server)
//         .post('/api/userEvents')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({ event_id: '111111111111111111111111' });

//       expect(res.status).to.be.eql(404);
//       expect(res.body).to.have.property('message');
//       expect(res.body.message).to.equal('Event with id 111111111111111111111111 does not exist.');
//     });

//     it('should not create a UserEvent document if event id is invalid', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       const res = await request(server)
//         .post('/api/userEvents')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({ event_id: '1'});

//       expect(res.status).to.be.eql(422);
//       expect(res.body).to.have.property('message');
//       expect(res.body.name).to.equal('CastError');
//     });
//   });

//   describe('DELETE userEvents/:id', () => {

//     it('should delete requested id and return response 200 with validated credentials', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       // Create event without a UserEvent document
//       const newEvent = await db.Event.create(testUtils.event);

//       // Add user to event
//       const postRes = await request(server)
//         .post('/api/userEvents')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({ event_id: newEvent._id.toString(), user_id: this.newUserRes.body.user._id.toString() });

//       const res = await request(server)
//         .delete('/api/userEvents/' + postRes.body._id)
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token);

//       expect(res.status).to.be.equal(200);
//     });

//     it('should NOT delete requested id and return response 200 with invalid credentials', async () => {
//       testUtils.event.creator = this.newUserRes.body.user._id.toString();

//       // Create event without a UserEvent document
//       const newEvent = await db.Event.create(testUtils.event);

//       // Add user to event
//       const postRes = await request(server)
//         .post('/api/userEvents')
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token)
//         .send({ event_id: newEvent._id.toString(), user_id: this.newUserRes.body.user._id.toString() });

//       const otherUser = await request(server)
//         .post('/auth/signup')
//         .send({
//           first_name: 'first',
//           last_name: 'last',
//           password: '1234',
//           email: 'otheruser@email.com'
//         });

//       const res = await request(server)
//         .delete('/api/userEvents/' + postRes.body._id)
//         .set('Authorization', 'bearer ' + otherUser.body.token);

//       expect(res.status).to.be.equal(422);
//       expect(res.body.message).to.equal('You are not authorized to perform this action');
//     });

//     it('should delete all UserEvents for deleted Event with field UserEvent.event_id === Event._id , and return response 200', async () => {
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

//       // Add other user to event
//       await request(server)
//         .post('/api/userEvents')
//         .set('Authorization', 'bearer ' + otherUser.body.token)
//         .send({ event_id: eventRes.body._id.toString(), user_id: otherUser.body.user._id.toString() });

//       const deleteRes = await request(server)
//         .delete('/api/events/' + eventRes.body._id)
//         .set('Authorization', 'bearer ' + this.newUserRes.body.token);

//       const foundUserEventsRes = await request(server)
//         .get(`/api/userEvents/user/${otherUser.body.user._id.toString()}`);

//       const founduserEvents = await db.UserEvent.find({ event_id: deleteRes.body._id });

//       expect(founduserEvents.length).to.be.equal(0);
//       expect(foundUserEventsRes.body.length).to.be.equal(0);
//     });
//   });
// });