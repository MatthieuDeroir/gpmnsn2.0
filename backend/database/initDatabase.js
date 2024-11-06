// database/initDatabase.js
const db = require('./database');

const initDB = () => {
    db.serialize(() => {
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      )`,
            (err) => {
                if (err) {
                    console.error('Error creating users table:', err.message);
                } else {
                    console.log('Users table ready.');
                }
            }
        );
    });
};

module.exports = initDB;
