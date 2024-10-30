// controllers/authController.js
const bcrypt = require('bcryptjs');
const users = require('../Models/userModel');
const { signToken } = require('../utils/jwtUtils');

exports.login = (req, res) => {
    const { username, password } = req.body;

    // Find user
    const user = users.find((u) => u.username === username);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Sign token
    const token = signToken({ id: user.id, role: user.role });

    res.json({ token, role: user.role });
};
