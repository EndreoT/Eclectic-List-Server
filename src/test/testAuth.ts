//Require the dev-dependencies
import { expect } from 'chai';
import * as request from 'supertest';
import { } from 'mocha';

import { utils } from './utilsForTests';
import { expressServer } from './init';;


//Our parent block
describe('Authentication', () => {

  beforeEach(async () => { // Before each test we empty the databaseP
    await utils.dropAllCollections();
  });

  after(async () => {
    await utils.dropAllCollections();
  });

  describe('POST /auth/signup', () => {

    it('should return user and token when the all request body is valid', async () => {
      const userRes = await request(expressServer)
        .post('/auth/signup')
        .send(utils.user);

      const user = userRes.body.user;
      expect(userRes.status).to.equal(200);
      expect(user).to.have.property('email', utils.user.email);
      expect(user).to.have.property('username', utils.user.username);
      expect(userRes.body).to.have.property('token');
    });
  });

  describe('POST /auth/login', () => {
    it('should return user and token when the email and password are valid', async () => {
      await request(expressServer)
        .post('/auth/signup')
        .send(utils.user);
      const res = await request(expressServer)
        .post('/auth/login')
        .send({ email: utils.user.email, password: utils.user.password });
      expect(res.status).to.equal(200);
      const user = res.body.user;
      expect(user).to.have.property('email', utils.user.email);
      expect(user).to.have.property('username', utils.user.username);
      expect(res.body).to.have.property('token');
    });

    it('should NOT return user and token when the email is valid, but the password is not valid', async () => {
      await request(expressServer)
        .post('/auth/signup')
        .send(utils.user);
      const res = await request(expressServer)
        .post('/auth/login')
        .send({ email: utils.user.email, password: 'asdfg' });
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
    });

    it('should NOT return user and token when the email is not valid', async () => {
      await request(expressServer)
        .post('/auth/signup')
        .send(utils.user);
      const res = await request(expressServer)
        .post('/auth/login')
        .send({ email: 'notanemail@email.com', password: 'asdfg' });
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
    });

    it('should NOT return user and token when credentials are not provided', async () => {
      await request(expressServer)
        .post('/auth/signup')
        .send(utils.user);
      const res = await request(expressServer)
        .post('/auth/login')
        .send();
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
    });
  });

  describe('GET /auth/protected/:id', () => {

    it('should access protected route with validated credentials', async () => {
      const newUser = await request(expressServer)
        .post('/auth/signup')
        .send(utils.user);

      const authRes = await request(expressServer)
        .get('/auth/protected/' + newUser.body.user._id)
        .set('Authorization', 'bearer ' + newUser.body.token);

      expect(authRes.body).to.have.property('message', 'I\'m protected!');
    });

    it('should NOT access a protected route with invalidated credentials', async () => {
      const newUser = await request(expressServer)
        .post('/auth/signup')
        .send(utils.user);

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

      expect(authRes.body).to.have.property('message', 'You are not authorized to perform this action');
    });

    it('should NOT access a protected route with a valid JWT but no user in DB', async () => {
      const newUser = await request(expressServer)
        .post('/auth/signup')
        .send(utils.user);

      const authRes = await request(expressServer)
        .get('/auth/protected/' + newUser.body.user._id)
        .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkNTk4ZTc1ZDkxZWYyNGZmNDQ2MjgyYiIsInVzZXJuYW1lIjoiZmlyc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIn0sImlhdCI6MTU2NjE1MDI2MSwiZXhwIjoxNTY2NzU1MDYxfQ.qIa8bHd7-JVSkuDozSksN6XJfikB6DBhggtL5coD9EE');

      expect(authRes.body).to.have.property('message', 'The user in the token was not found');
    });

    it('should NOT access a protected route with an invalid JWT', async () => {
      const newUser = await request(expressServer)
        .post('/auth/signup')
        .send(utils.user);

      const authRes = await request(expressServer)
        .get('/auth/protected/' + newUser.body.user._id)
        .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkNTk4ZTc1ZDkxZWYyNGZmNDQ2MjgyYiIsInVzZXJuYW1lIjoiZmlyc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIn0sImlhdCI6MTU2NjE1MDI2MSwiZXhwIjoxNTY2NzU1MDYxfQ.qIa8bHd7-JVSkuDozSksN6XJfikB6DBhggtL5coD9Ex');

      expect(authRes.body.message.slice(0, 17)).to.equal('invalid signature');
    });

    it('should NOT access a protected route with no JWT provided', async () => {
      const newUser = await request(expressServer)
        .post('/auth/signup')
        .send(utils.user);

      const authRes = await request(expressServer)
        .get('/auth/protected/' + newUser.body.user._id);

      expect(authRes.body.message).to.equal('No auth token');
    });

  });

});
