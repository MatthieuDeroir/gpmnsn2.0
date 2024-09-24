import { Sequelize } from 'sequelize';

export class Database {
    static sequelize;

    static async Connect() {
        try {
            this.sequelize = new Sequelize({
                dialect: 'sqlite',
                storage: process.env.DB_URI || 'database.sqlite'
            });

            await this.sequelize.authenticate();
            console.log('Successfully connected to SQLite3');
        } catch (error) {
            console.error('Error connecting to SQLite3:', error);
        }
    }

    static async HandleOperation(operation) {
        try {
            return await operation(this.sequelize);
        } catch (err) {
            console.error(err);
            throw err;  // this error will now be passed back to be handled by the calling function
        }
    }
}

export default Database;
