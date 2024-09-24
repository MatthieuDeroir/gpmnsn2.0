import { Sequelize, DataTypes } from 'sequelize';

// Initialize Sequelize with SQLite3
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_URI || 'database.sqlite'
});

// Define the User model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roles: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Export the User model
export default User;

// Sync the model with the database
(async () => {
    try {
        await sequelize.sync();
        console.log('User table has been synchronized');
    } catch (error) {
        console.error('Error synchronizing the User table:', error);
    }
})();
