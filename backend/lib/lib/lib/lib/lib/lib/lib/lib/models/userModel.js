'use strict';

// models/userModel.js
var _require = require('sequelize'),
  DataTypes = _require.DataTypes;
var sequelize = require('../database/database');
var User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Add unique constraint
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
module.exports = User;