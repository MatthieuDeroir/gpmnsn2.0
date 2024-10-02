import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import wss from './websocket/Websocket';
import Database from './Database/Database';
const Logger = require('./websocket/logger'); // Import your logger

require('dotenv').config();

const app = express();

app.disable('x-powered-by');
Database.Connect().then(() => {
    console.log('Connected to database');
    wss();
}).catch((err) => {
    console.error('Error connecting to database:', err);
});

app.use(express.static("medias"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => res.send(`Le serveur fonctionne sur le port : ${process.env.PORT}`));

app.get('/logs/:type/:value', (req, res) => {
    const type = req.params.type; // Can be "panel" or "role"
    const value = req.params.value; // Can be "allpanels", "aval", "amont", "indret", or "allusers", "maintenance", etc.
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(0);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const searchQuery = req.query.search || ''; // Search query from frontend
    endDate.setHours(23, 59, 59, 999); // Ensure we include the full day
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }
  
    try {
      let logData;
      if (type === 'panel') {
        logData = Logger.getPanelLogs(value, page, limit, startDate, endDate, searchQuery);
      } else if (type === 'role') {
        logData = Logger.getRoleLogs(value, page, limit, startDate, endDate, searchQuery);
      } else {
        return res.status(400).json({ error: 'Invalid type, must be "panel" or "role"' });
      }
      res.json(logData);
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/logs/search', (req, res) => {
    const query = req.query.query.toLowerCase(); // Get the search query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
  
    try {
      const logData = Logger.searchLogs(query, page, limit);
      res.json(logData);
    } catch (error) {
      console.error('Error searching logs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  



app.listen(PORT, () => console.log(`Le serveur fonctionne sur le port : ${PORT}`));
