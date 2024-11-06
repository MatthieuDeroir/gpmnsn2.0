// models/logModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Log = sequelize.define('Log', {
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    panelName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eventType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    details: {
        type: DataTypes.JSON,
        allowNull: true,
    },
});

module.exports = Log;
