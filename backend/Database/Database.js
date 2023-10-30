import mongoose from 'mongoose';

export class Database {
    static async Connect() {
        mongoose.Promise = global.Promise;

        try {
            await mongoose.connect(process.env.DB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Successfully connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }

    static async HandleOperation(operation) {
        try {
            return await operation();
        } catch (err) {
            console.error(err);
            throw err;  // this error will now be passed back to be handled by the calling function
        }
    }
}

export default Database;