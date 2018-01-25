const jwt = require('jsonwebtoken');

// Authentication Middleware
function verifyAuth(req, res, next) {
	// Grab the Auth header, and get just the token portion
	// Header format: Authorization: Bearer [token]
	let authToken = req.get('Authorization').split(' ')[1];

	if(!authToken) {
		return res.status(401)
							.send(JSON.stringify({
								status: 'Failed',
								message: 'Unauthorized access. Please check that you are logged in and try again.'
							}));
	}

	// Verify token
	jwt.verify(authToken, process.env.SECRET, (err, token) => {
		// Handle invalid token
		if(err) {
			return res.status(401)
								.send(JSON.stringify({
									status: 'Failed',
									message: 'Unauthorized access. Please check that you are logged in and try again.'
								}));
		}

		// Valid token, continue with request
		next();
	});
}

module.exports = {
	verifyAuth: verifyAuth
};