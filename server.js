const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();

const {verifyAuth, ignoreFavicon} = require('./routes/middleware');
const users = require('./routes/user_routes');
const login_register = require('./routes/login_register_routes');

// Used for setting up environment variables in Development environment
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Database Setup - Mongoose
mongoose.Promise = global.Promise;

// Check if we are running tests
if(process.env.NODE_ENV == 'test'){
	mongoose.connect('mongodb://localhost/circuit-studio-test-api');
}
else {
	mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/circuit-studio-api');
	app.use(morgan('combined')); // Only use logs when not testing
}

// Ignore Favicon requests
// app.get('/favicon.ico', (req, res) => {
// 	return res.status(204);
// });
app.use(ignoreFavicon);

// Setup Unprotected Routes
app.use('/auth', login_register);
// app.use('/components', components);

// Authentication Middleware
app.use(verifyAuth);

// Setup Authenticated Routes
app.use('/users', users);

// Start the app and listen on PORT
app.listen(PORT, () => 
	console.log(`Express server listening port ${PORT} in mode ${app.settings.env}`)
);

module.exports = app; // Used for testing
