const express = require('express');
const morgan = require('morgan');
const app = express();
const {verifyAuth, ignoreFavicon} = require('./routes/middleware');
const users = require('./routes/user_routes');
const login_register = require('./routes/login_register_routes');

// Used for setting up environment variables in Development environment
require('dotenv').config();

// Only use logs when not testing
if(process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined')); 
}

// Ignore Favicon requests
app.use(ignoreFavicon);

// Setup Unprotected Routes
app.use('/auth', login_register);

// Authentication Middleware
app.use(verifyAuth);

// Setup Authenticated Routes
app.use('/users', users);

module.exports = app;