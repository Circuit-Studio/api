const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const User = require('../models/user');

router.use(bodyParser.json());

// GET /users
router.get('/', (req, res) => {
	User.find({}, '_id username', (err, users) => {
		if (err) {
			return res.status(500).json({
				status: 'Internal Server Error',
				message: 'Please try request again.'
 			});
		}
		else {
			return res.status(200).json({
				status: 'Success',
				message: 'Returning all users.',
				data: users
			});
		}
	});

});

// GET /users/:id
router.get('/:id', (req, res) => {
	if (isAuthorized(req) == false) {
		return res.status(404).json({
			status: 'User Not Found',
			message: 'Please check id and try again.'
		});
	}

	User.findById(req.params.id, 'username email', (err, user) => {
		if (err) {
			return res.status(500).json({
				status: 'Internal Server Error',
				message: 'Please try request again.'
 			});
		}
		else if (user == undefined) {
			return res.status(404).json({
				status: 'User Not Found',
				message: 'Please check id and try again.'
			});
		}
		else {
			return res.status(200).json({
				status: 'Success',
				message: 'Returning user data.',
				data: user
			});
		}
	});
})

// DELETE /users/:id
// In reality this route deactives the user rather than deleting them
router.delete('/users/:id', (req, res) => {
	// Verify that 
	User.findByIdAndModify(req.params.id, { $set: { active: false }}, (err) => {
    if (err) {
      return res.status(500).json({
        status: 'Internal Error',
        message: 'Please try request again.'
      });
    }

    // Successfully "deleted" resource
    return res.status(204).json({
      status: 'No Content',
      message: 'Resource was deleted.'
    });
	});
});

// Verifies user is allowed to make request
function isAuthorized(req) {
  return req.params.id == req.user._id
}

module.exports = router;