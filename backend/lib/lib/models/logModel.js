"use strict";

// models/logModel.js
var _require = require('sequelize'),
  DataTypes = _require.DataTypes;
var sequelize = require('../database/database');
var Log = sequelize.define('Log', {
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  panelName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true
  }
});
module.exports = Log;