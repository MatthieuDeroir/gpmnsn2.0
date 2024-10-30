// utils/jwtUtils.js
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Use environment variables in production

const signToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};

module.exports = { signToken, verifyToken };
