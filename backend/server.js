// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./database/database'); // Import the Sequelize instance
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
const websocketController = require('./controllers/websocketController');
const cookieParser = require('cookie-parser');

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Disable 'x-powered-by' header
app.disable('x-powered-by');

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.static('medias'));

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize the database and sync models
sequelize.authenticate()
    .then(() => {
        console.log('Connection to SQLite database established successfully.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('All models were synchronized successfully.');
        // Initialize the WebSocket server
        websocketController.initializeWebsocket();
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/logs', logRoutes);  // Log routes (if you have one)

// Root endpoint
app.get('/', (req, res) => res.send(`Server is running on port: ${process.env.PORT || 4000}`));

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
