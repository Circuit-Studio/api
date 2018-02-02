const jwt = require('jsonwebtoken');

function createTestToken() {
  let token = jwt.sign({username: 'test-user'}, process.env.SECRET);
  return token;
}

module.exports = {createTestToken};