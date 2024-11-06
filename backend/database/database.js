// database/database.js
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_URI || path.join(__dirname, 'database.sqlite'),
    logging: false, // Disable logging if desired
});

module.exports = sequelize;
