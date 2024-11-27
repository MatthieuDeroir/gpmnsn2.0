// controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { signToken } = require('../utils/jwtUtils');
const Logger = require('../utils/logger'); // Import du Logger
const jwt = require('jsonwebtoken'); // Assurez-vous d'importer jwt si nécessaire
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Trouver l'utilisateur
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Créer une charge utile simple
        const payload = {
            id: user.id,
            role: user.role,
            username: user.username, // Inclure le nom d'utilisateur dans le token
        };

        // Signer le token avec la charge utile
        const token = signToken(payload); // Génère le JWT

        // Enregistrer la connexion dans les journaux
        await Logger.appendLog(
            'frontend', // Nom du panneau (ou null si pas applicable)
            'User Login', // Type d'événement
            {
                username: user.username,
                role: user.role,
                message: 'User logged in',
            }
        );

        // Retourner le token et le rôle
        res.json({ token, role: user.role });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        const user = req.user;

        // Effacer le cookie 'token'
        res.clearCookie('token');

        // Enregistrer la déconnexion dans les journaux
        await Logger.appendLog(
            'frontend', // Nom du panneau (ou null si pas applicable)
            'User Logout', // Type d'événement
            {
                username: user.username,
                role: user.role,
                message: 'User logged out',
            }
        );

        res.json({ message: 'Déconnexion réussie' });
    } catch (err) {
        console.error('Error during logout:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
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
