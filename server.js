const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Used for setting up environment variables in Development environment
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Database Setup - Mongoose
mongoose.Promise = global.Promise; // Maybe use Bluebird?
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/circuit-studio-api');

// Start the app and listen on PORT
app.listen(PORT, () => 
	console.log(`Express server listening port ${PORT} in mode ${app.settings.env}`)
);