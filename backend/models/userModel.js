// models/userModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Add unique constraint
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User;
