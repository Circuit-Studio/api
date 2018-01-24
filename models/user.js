const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	createdAt: { type: Date },
	updatedAt: { type: Date },
	password:  { type: String, required: true, select: false },
	username:  { type: String, required: true},
	email:     { type: String, required: true}
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