// seedUsers.js
const bcrypt = require('bcryptjs');
const sequelize = require('./database/database'); // Adjust the path if necessary
const User = require('./models/userModel');       // Adjust the path if necessary
const dotenv = require('dotenv');

dotenv.config();

async function seedUsers() {
    try {
        // Sync the database (ensure tables are created)
        await sequelize.sync();

        // Hash the password
        const MaintenanceHashedPassword = await bcrypt.hash(process.env.PSWD_MAINTENANCE, 10);
        const OperateurHashedPassword = await bcrypt.hash(process.env.PSWD_OPERATEUR, 10);
        const VisualisateurHashedPassword = await bcrypt.hash(process.env.PSWD_VISUALISATEUR, 10);

        // Create users
        await User.create({
            username: 'Maintenance',
            password: MaintenanceHashedPassword,
            role: 'Maintenance',
        });

        await User.create({
            username: 'Operateur',
            password: OperateurHashedPassword,
            role: 'Operateur',
        });

        await User.create({
            username: 'Visualisateur',
            password: VisualisateurHashedPassword,
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
