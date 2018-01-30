const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const User = require('../models/user');

router.use(bodyParser.json());

// GET /users
router.get('/', (req, res) => {
	return res.status(200)
						.json({
							message: 'Got all users.'
						});
});

module.exports = router;