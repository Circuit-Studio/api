const jwt = require('jsonwebtoken');

function createTestToken(user) {
  let token = jwt.sign({_id: user._id, username: user.username}, process.env.SECRET);
  return token;
}

module.exports = {createTestToken};