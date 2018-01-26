// Set environment to test while testing
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {
	beforeEach((done) => {
		User.remove({}, (err) => {
			done();
		});
	});
	/*
	 *  Test Registering a New User
	 */
	describe('/POST /auth/register', () => {
		it('should not create a new user without a username', (done) => {
			let user = {
				username: '',
				email: 'user@gmail.com',
				password: 'password'
			};

			chai.request(server)
					.post('/auth/register')
					.send(user)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						res.body.should.have.property('status').eql('Failed');
						res.body.should.have.property('message')
																.that.contains('Path `username` is required.');
						done();
					});
		});
		it('should not create a new user without an email', (done) => {
			let user = {
				username: 'test-user',
				email: '',
				password: 'password'
			};

			chai.request(server)
					.post('/auth/register')
					.send(user)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						res.body.should.have.property('status').eql('Failed');
						res.body.should.have.property('message')
																.that.contains('Path `email` is required.');
						done();
					});
		});
		it('should not create a new user without a password', (done) => {
			let user = {
				username: 'test-user',
				email: 'user@gmail.com',
				password: ''
			};

			chai.request(server)
					.post('/auth/register')
					.send(user)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						res.body.should.have.property('status').eql('Failed');
						res.body.should.have.property('message')
																.that.contains('Path `password` is required.');
						done();
					});
		});
		it('should not create a new user if username is too short', (done) => {
			let user = {
				username: 'test',
				email: 'user@gmail.com',
				password: 'password'
			};

			chai.request(server)
					.post('/auth/register')
					.send(user)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						res.body.should.have.property('status').eql('Failed');
						res.body.should.have.property('message')
																.that.contains('Username is too short.');
						done();
					});
		});
		it('should not create a new user if password is too short', (done) => {
			let user = {
				username: 'test-user',
				email: 'user@gmail.com',
				password: 'pass'
			};

			chai.request(server)
					.post('/auth/register')
					.send(user)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						res.body.should.have.property('status').eql('Failed');
						res.body.should.have.property('message')
																.that.contains('Password is too short.');
						done();
					});
		});
		it('should not create a new user if email is invalid', (done) => {
			let user = {
				username: 'test-user',
				email: 'user@mail',
				password: 'password'
			};

			chai.request(server)
					.post('/auth/register')
					.send(user)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						res.body.should.have.property('status').eql('Failed');
						res.body.should.have.property('message')
																.that.contains('Not a valid email address.');
						done();
					});
		});
		it('should create a new user if valid', (done) => {
			let user = {
				username: 'test-user',
				email: 'user@gmail.com',
				password: 'password'
			};

			chai.request(server)
					.post('/auth/register')
					.send(user)
					.end((err, res) => {
						res.should.have.status(201);
						res.body.should.be.a('object');
						res.body.should.have.property('status').eql('Success');
						res.body.should.have.property('message')
																.that.contains(`${user.username} was created.`);
						done();
					});
		});
	});

});