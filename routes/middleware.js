const jwt = require('jsonwebtoken');

// Authentication Middleware
function verifyAuth(req, res, next) {
	// Grab the Auth header, and get just the token portion
	// Header format: Authorization: Bearer [token]
	let authToken = req.get('Authorization');

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

// Used to ignore the Favicon request
function ignoreFavicon(req, res, next) {
	if(req.originalUrl === '/favicon.ico') {
		return res.status(204)
							.json({
								status: 'Not Found'
							});
	}
	else {
		// Just continue for any other request
		next();
	}
}

module.exports = {verifyAuth, ignoreFavicon};