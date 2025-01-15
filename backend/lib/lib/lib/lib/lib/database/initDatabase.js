"use strict";

// database/initDatabase.js
var db = require('./database');
var initDB = function initDB() {
  db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS users (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        username TEXT UNIQUE NOT NULL,\n        password TEXT NOT NULL,\n        role TEXT NOT NULL\n      )", function (err) {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table ready.');
      }
    });
  });
};
module.exports = initDB;