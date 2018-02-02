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
	if (isAuthorized(req) == false) {
		return res.status(404)
							.json({
								status: 'Not Found',
								message: 'Could not find user. Please check id and try again.'
							});
	}

	User.findById(req.user._id, '_id username email', (err, user) => {
		if (err) {
			return res.status(500)
				 				.json({
				 					status: 'Failed',
				 					message: 'Internal error. Please try again.'
				 				});
		}
		else if (user == undefined) {
			return res.status(404)
								.json({
									status: 'Not Found',
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

// DELETE /users/:id
router.delete('/:id', (req, res) => {
	// Verify that 
	User.findByIdAndRemove(req.params.id, (err) => {

	})
});

// Verifies user is allowed to make request
function isAuthorized(req) {
	// User is not authorized
	if (req.params.id !== req.user._id) {
		return false
	}

	// User is authorized to perform action
	return true
}

module.exports = router;