const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  password: { 
    type: String, 
    required: true,
    minlength: [6, 'Password is too short.'],
    select: false 
  },
  username: { 
    type: String, 
    required: true,
    minlength: [8, 'Username is too short.']
  },
  email: { 
    type: String,
    validate: {
      validator: function(v) {
        return isEmail(v);
      },
      message: 'Not a valid email address.'
    },
    required: true
  }
});

// Updated/Created
UserSchema.pre('save', function(next) {
  let now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  let user = this;
  if (!user.isModified('password')) {
    return next();
  }

  // Salting
  bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
  });
});

// Comparing the password as a method
UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);