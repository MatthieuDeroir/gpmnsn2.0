import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_URI || 'database.sqlite'
});

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

export default User;

(async () => {
    try {
        await sequelize.sync();
        console.log('User table has been synchronized');
    } catch (error) {
        console.error('Error synchronizing the User table:', error);
    }
})();
