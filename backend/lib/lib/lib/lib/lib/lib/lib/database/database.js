"use strict";

// database/database.js
var _require = require('sequelize'),
  Sequelize = _require.Sequelize;
var path = require('path');
var sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_URI || path.join(__dirname, 'database.sqlite'),
  logging: false // Disable logging if desired
});
module.exports = sequelize;