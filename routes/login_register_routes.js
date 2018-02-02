const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const logger = require('../utils/logger');

const User = require('../models/user');

router.use(bodyParser.json());

// POST /register
router.post('/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  // Check whether a user already exists with email or username
  User.findOne({
    $or: [{email: email},
          {username: username}]
  })
  .then( user => {
    // If user is nil, continue with creation
    if(!user) {
      let user = new User(req.body);

      // Save will attempt to validate properties
      user.save((err) => {
        // If validation failed, return reason why
        if(err) {
          errorMessages = [];
          for(var key in err.errors) {
            errorMessages.push(err.errors[key].message);
          }
          res.status(400).json({
            status: 'Failed',
            message: errorMessages
          });
        }
        else {
          // Success, return proper message
          res.status(201).json({
            status: 'Success',
            message: `${username} was created.`
          });
        }
      });
    }
    else {
      res.status(403).json({
        status: 'Forbidden',
        message: 'A user already exists with that username or email address.'
      });
    }
  })
  .catch( err => {
    logger.error(`Find User Error: ${err}`);
    res.status(400).json({
        status: 'Failed',
        message: 'Something went wrong, please try again.'
      });
  });
});

// POST /login
router.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  // Validate there are no empty fields
  if(!email || !password) {
    res.status(400).json({
      status: 'Failed',
      message: 'Cannot have empty fields.'
    });
  }

  User.findOne({
    email: email
  })
  .select('+password')
  .then(user => {
    if(!user) {
      // Unable to find the user
      return res.status(401).json({
        status: 'Unauthorized',
        message: 'Please check credentials and try again.'
      });
    }

    // Check that the password matches
    user.comparePassword(password, (err, isMatch) => {
      if(err) {
        // Log internal error to console
        logger.error(`Internal Error: ${err}`);

        res.status(500).json({
          status: 'Internal Server Error',
          message: 'Please try request again.'
        });
      }

      // Validate Credentials
      if(isMatch) {
        // Generate JWT token and return it
        let token = jwt.sign({ _id: user._id, username: user.username}, process.env.SECRET);

        res.status(200).json({
          status: 'Success',
          message: `${user.username} successfully logged in.`,
          data: { 
            token: token,
            username: user.username,
            id: user._id
          }
        });
      }
      else {
        // Password did not match (aka. Invalid Credentials)
        res.status(401).json({
          status: 'Unauthorized',
          message: 'Please check credentials and try again.'
        });
      }
    });
  });
});

module.exports = router;