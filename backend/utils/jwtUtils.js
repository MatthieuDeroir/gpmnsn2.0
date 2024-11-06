// utils/jwtUtils.js
const jwt = require('jsonwebtoken');

function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

module.exports = {
    signToken,
};
