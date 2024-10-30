// middleware/authMiddleware.js
const { verifyToken } = require('../utils/jwtUtils');

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};
