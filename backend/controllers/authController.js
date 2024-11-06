
// controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { signToken } = require('../utils/jwtUtils');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // **Create a simple payload**
        const payload = {
            id: user.id,
            role: user.role,
        };

        // **Sign token with the simple payload**
        const token = signToken(payload); // Génère le JWT

        // Définir le cookie 'token' avec le JWT
        res.json({ token, role: user.role });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            role,
        });

        res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    } catch (err) {
        console.error('Error during registration:', err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};


exports.checkAuth = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Non authentifié' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ role: payload.role });
    } catch (error) {
        res.status(403).json({ message: 'Jeton invalide' });
    }
};


exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Déconnexion réussie' });
};

