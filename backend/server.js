// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./database/database'); // Sequelize instance
const authRoutes = require('./routes/authRoutes');  // exemple
const logRoutes = require('./routes/logRoutes');    // exemple

// On importe la "factory" de routes
const createPanelRoutes = require('./routes/panelRoutes');

// On importe les fonctions pour le WebSocketServer et le clientManager
const { createWebSocketServer, getClientManager } = require('./controllers/websocketController');

const cookieParser = require('cookie-parser');
const Logger = require('./utils/logger');

// Charger variables d'environnement
dotenv.config();

// Créer l'appli Express
const app = express();

// Retirer l'en-tête "x-powered-by"
app.disable('x-powered-by');

// Middlewares
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.static('medias'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialiser la base de données
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to SQLite database established successfully.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('All models were synchronized successfully.');

        // *** Ici on démarre le WebSocketServer ***
        createWebSocketServer();
        // => Lancement du WS sur le port 8080

    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Routes REST
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

// Récupérer le clientManager (maintenant qu'on a lancé createWebSocketServer())
const clientManager = getClientManager();
if (!clientManager) {
    console.error('ClientManager is not initialized yet. Check the order of calls!');
}

// Créer les routes "panel" et injecter clientManager
const panelRoutes = createPanelRoutes(clientManager);
app.use('/api/panel', panelRoutes);

// Endpoint racine
app.get('/', (req, res) => {
    res.send(`Server is running on port: ${process.env.PORT || 4000}`);
});

// Lancement du serveur HTTP Express
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);

    Logger.appendLog('backend', 'Server Started', {
        message: `Express server started on port ${PORT}`,
    });
});
