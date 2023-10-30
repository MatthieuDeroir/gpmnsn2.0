import express from 'express';
import mongoose from 'mongoose';
import bodyparser from 'body-parser';
import cors from 'cors';
import routes from './Routes';
import wss from './websocket';
import Database from './Database/Database';

require('dotenv').config()

const app = express();

app.disable('x-powered-by');
Database.Connect().then(() => {
    console.log('Connected to database');
    wss();
}).catch((err) => {
    console.error('Error connecting to database:', err);
});

app.use(express.static("medias"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cors());

routes(app);
app.get('/', (req, res) => res.send(`Le serveur fonctionne sur le port : ${process.env.PORT}`));

app.listen(PORT, () => console.log(`Le serveur fonctionne sur le port : ${process.env.PORT}`));
