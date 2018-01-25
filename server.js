const express = require('express');
const mongoose = require('mongoose');
const app = express();

const {verifyAuth} = require('./routes/middleware');
const users = require('./routes/user_routes');
const login_register = require('./routes/login_register_routes');

// Used for setting up environment variables in Development environment
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Database Setup - Mongoose
mongoose.Promise = global.Promise; // Maybe use Bluebird?
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/circuit-studio-api');

// Setup Unauthenticated Routes
// GET /components
app.use('/auth', login_register);
// app.use('/components', components);

// Authentication Middleware
app.use((req, res, next) => verifyAuth(req, res, next));

// Setup Authenticated Routes
app.use('/users', users);

// Start the app and listen on PORT
app.listen(PORT, () => 
	console.log(`Express server listening port ${PORT} in mode ${app.settings.env}`)
);