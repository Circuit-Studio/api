const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const User = require('../models/user');

router.use(bodyParser.json());

// POST /register
router.post('/register', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email;

	// Validate no fields are empty
	if(!username || !password || !email) {
		return res.status(400)
							.json({ 
								status: 'Failed', 
								message: 'Cannot have empty fields'
							});
	}

	// Check whether a user already exists with email or username
	User.findOne({
		$or: [{email: email},
					{username: username}]
	})
	.then( user => {
		// If user is nil, continue with creation
		if(!user) {
			let user = new User(req.body);
			user.save();

			// Return the created user
			return res.status(201)
				 				.json({
				 	 				status: 'Success',
				 	 				message: `${username} was created.`
				 				});
		}
		else {
			return res.status(400)
				 				.json({
				 	 				status: 'Failed',
				 	 				message: 'A user already exists with that username or email address.'
				 				});
		}
	})
	.catch( err => {
		return res.status(400)
			 				.json({
			 	 				status: 'Failed',
			 	 				message: `Error: ${err}`
			 				});
	});
});

// POST /login
router.post('/login', (req, res) => {
	let email = req.body.email;
	let password = req.body.password;

	// Validate there are no empty fields
	if(!email || !password) {
		return res.status(400)
							.json({
								status: 'Failed',
								message: 'Cannot have empty fields.'
							});
	}

	User.findOne({
		email: email
	})
	.select('+password')
	.then(user => {
		if(!user) {
			// Unable to find the user
			return res.status(400)
								.json({
									status: 'Failed',
									message: 'Invalid credentials. Please check credentials and try again.'
								});
		}

		// Check that the password matches
		user.comparePassword(password, (err, isMatch) => {
			if(err) {
				// Log internal error to console
				console.log(`Internal Error: ${err}`);

				return res.status(500)
									.json({
										status: 'Failed',
										message: '500 Internal Server Error'
									});
			}

			// Validate Credentials
			if(isMatch) {
				// Generate JWT token and return it
				let token = jwt.sign({ _id: user._id, username: user.username}, process.env.SECRET);
				return res.status(200)
									.json({
										status: 'Success',
										message: `${user.username} successfully logged in.`,
										token: token
									});
			}
			else {
				// Password did not match (aka. Invalid Credentials)
				return res.status(400)
									.json({
										status: 'Failed',
										message: 'Invalid credentials. Please check credentials and try again.'
									});
			}
		});
	});
});

module.exports = router;