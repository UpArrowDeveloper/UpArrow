const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (email) => jwt.sign({ email }, env.jwtTokenSecretKey);
const verifyToken = (jwtToken) => jwt.verify(jwtToken, env.jwtTokenSecretKey);

module.exports = {
  generateToken,
  verifyToken,
};
