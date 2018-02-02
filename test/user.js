process.env.NODE_ENV = 'test';

const db_connect = require('../utils/db');
const {createTestToken} = require('../utils/test');
const User = require('../models/user');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

// Setup test db
before((done) => {
  db_connect.open().then(() => { done(); }).catch(done);
});

// Tear down test db
after((done) => {
  db_connect.close().then(() => { done(); }).catch(done);
});

describe('Users', () => {
  let authToken = null;
  let user = null;

  // Reset the database after each test
  afterEach((done) => {
    User.remove({}, (err) => { done(); });
  });

  // ========================
  //
  //  Test Fetching All Users
  //  
  // ========================
  
  describe('GET /users', () => {
    // Add a user to database before each test
    beforeEach((done) => {
      user = new User({
        username: 'test-user',
        email: 'user@mail.com',
        password: 'password'
      });

      user.save((err, saved_user) => { 
        authToken = createTestToken(saved_user);
        done();
      });
    });

    context('no users in database', () => {
      it('should return an empty array', (done) => {
        User.remove({}, (err) => {
          chai.request(server)
              .get('/users')
              .set('Authorization', authToken)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql('Success');
                res.body.should.have.property('message');
                res.body.message.should.contain('Returning all users.');
                res.body.should.have.property('data');
                res.body.data.should.be.a('array');
                res.body.data.length.should.be.eql(0);
                done();
              });
        });
      });
    });

    context('one user in database', () => {
      it('should return an array of one user', (done) => {
        chai.request(server)
            .get('/users')
            .set('Authorization', authToken)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property('status').eql('Success');
              res.body.should.have.property('message');
              res.body.message.should.contain('Returning all users.');
              res.body.should.have.property('data');
              res.body.data.should.be.a('array');
              res.body.data.length.should.be.eql(1);
              done();
            });
      });
    });

    context('multiple users in database', () => {
      it('should return an array of all users', (done) => {
        let new_user = new User({
          username: 'test-user2',
          email: 'user2@mail.com',
          password: 'password'
        });

        // Add second user to ensure multiple users are returned
        new_user.save().then(() => {
          chai.request(server)
              .get('/users')
              .set('Authorization', authToken)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql('Success');
                res.body.should.have.property('message');
                res.body.message.should.contain('Returning all users.');
                res.body.should.have.property('data');
                res.body.data.should.be.a('array');
                res.body.data.length.should.be.eql(2);
                done();
              });
        });
      });
    });
  });

  // ============================
  //
  //  Test Fetching Specific User
  //  
  // ============================

  describe('GET /users/:id', () => {
    beforeEach((done) => {
      user = new User({
        username: 'username',
        email: 'test@mail.com',
        password: 'password'
      });
      done();
    });

    context('user id is valid', () => {
      it('should return the correct user', (done) => {
        user.save((err, saved_user) => {
          authToken = createTestToken(saved_user);
          chai.request(server)
              .get('/users/' + saved_user._id)
              .set('Authorization', authToken)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql('Success');
                res.body.should.have.property('message');
                res.body.message.should.contain('Returning user data.');
                res.body.should.have.property('data');
                res.body.data.should.have.property('username').eql(user.username);
                res.body.data.should.have.property('email').eql(user.email);
                res.body.data.should.have.property('_id').eql(String(saved_user._id));
                done();
              });
        });
      });
    });

    context('user id is not a valid ObjectId', () => {
      it('should return an user not found', (done) => {
        user.save((err, saved_user) => {
          authToken = createTestToken(saved_user);
          chai.request(server)
              .get('/users/not-an-id')
              .set('Authorization', authToken)
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('status').eql('User Not Found');
                res.body.should.have.property('message');
                res.body.message.should.contain('Please check id and try again.');
                done();
              });
        });
      });
    });

    // Fails when a correctly formatted ObjectId is passed in,
    // but it does not correspond to a correct user in the collection
    context('user id is invalid', () => {
      it('should return a bad request and message', (done) => {
        user.save((err, saved_user) => {
          authToken = createTestToken(saved_user);
          chai.request(server)
              .get('/users/5a7238359b55b13b34f3cf2b')
              .set('Authorization', authToken)
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('status').eql('User Not Found');
                res.body.should.have.property('message');
                res.body.message.should.contain('Please check id and try again.');
                done();
              });
        });
      });
    });

  });

  /*
   *  Test Deleting A User
   */
  describe('DELETE /users/:id', () => {
    beforeEach((done) => {
      user = new User({
        username: 'username',
        email: 'test@mail.com',
        password: 'password'
      });
      done();
    });
    
    context('user id is valid', () => {
      it('should delete the user', (done) => {
        user.save((err, saved_user) => {
          authToken = createTestToken(saved_user);
          chai.request(server)
              .delete('/users/' + saved_user._id)
              .set('Authorization', authToken)
              .end((err, res) => {
                res.should.have.status(204);
                res.body.should.have.property('status').eql('No Content');
                res.body.should.have.property('message');
                res.body.message.should.contain('User was deleted.');
                saved_user.active.should.eql(false);
                done();
              });
        });
      });
    });
  });
});