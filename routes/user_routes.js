const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const User = require('../models/user');

router.use(bodyParser.json());

// GET /users
router.get('/', (req, res) => {
	User.find({}, '_id username', (err, users) => {
		if (err) {
			return res.status(500)
				 				.json({
				 					status: 'Failed',
				 					message: 'Internal error. Please try again.'
				 				});
		}
		else {
			return res.status(200)
								.json({
									status: 'Success',
									message: 'Fetched all users.',
									data: users
								});
		}
	});

});

// GET /users/:id
router.get('/:id', (req, res) => {
	User.findById(req.params.id, '_id username email', (err, user) => {
		if (err) {
			return res.status(500)
				 				.json({
				 					status: 'Failed',
				 					message: 'Internal error. Please try again.'
				 				});
		}
		else if (user == undefined) {
			return res.status(400)
								.json({
									status: 'Failed',
									message: 'Could not find user. Please check id and try again.'
								});
		}
		else {
			return res.status(200)
								.json({
									status: 'Success',
									message: 'Returning found user.',
									data: user
								});
		}
	});
});

module.exports = router;