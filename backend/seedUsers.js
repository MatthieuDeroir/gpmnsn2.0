// seedUsers.js
const bcrypt = require('bcryptjs');
const sequelize = require('./database/database'); // Adjust the path if necessary
const User = require('./models/userModel');       // Adjust the path if necessary

async function seedUsers() {
    try {
        // Sync the database (ensure tables are created)
        await sequelize.sync();

        // Hash the password
        const hashedPassword = await bcrypt.hash('password', 10);

        // Create users
        await User.create({
            username: 'Maintenance',
            password: hashedPassword,
            role: 'Maintenance',
        });

        await User.create({
            username: 'Operateur',
            password: hashedPassword,
            role: 'Operateur',
        });

        await User.create({
            username: 'Visualisateur',
            password: hashedPassword,
            role: 'Visualisation', // Assuming 'Visualisation' is the correct role name
        });

        console.log('Users have been added successfully.');
        process.exit();
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
}

seedUsers();
