import express from 'express';
import mongoose from 'mongoose';
import bodyparser from 'body-parser';
import cors from 'cors';
import routes from './Routes';
import wss from './websocket';

const app = express();
const PORT = 4000;

app.disable('x-powered-by');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/portNS');

app.use(express.static("medias"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

routes(app);
app.get('/', (req, res) => res.send(`Le serveur fonctionne sur le port : ${PORT}`));

app.listen(PORT, () => console.log(`Le serveur fonctionne sur le port : ${PORT}`));
