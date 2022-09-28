const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
import { initialization } from './initialization'

const fileupload = require("express-fileupload");
const cors = require('cors');

import routes from './routes/appRoutes';


const app = express();
const PORT = 4000;

process.env.NODE_ENV

// disabling mention
app.disable('x-powered-by')

// mongo connexion
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://127.0.0.1/portNS`)


// file upload setup
app.use(fileupload());
app.use(express.static("medias"));

// bodyparser setup
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// CORS setup
app.use(cors());

//POST
app.post("/upload", (req, res) => {
    const user = req.body.user
    const newpath = __dirname + `/../frontend/public/medias/${user}/`;
    const file = req.files.file;
    const hashedName = req.body.fileName
    const format = req.body.format
    console.log(hashedName)
    file.mv(`${newpath}${hashedName}.${format}`, (err) => {
        if (err) {
            res.status(500).send({ message: "File upload failed", code: 500 });
        } else {
            res.status(200).send({ message: "File Uploaded", code: 200 });
        }
    });
});

//routes
routes(app);

app.get('/', (req, res) =>
    res.send(`Le serveur fonctionne sur le port : ${PORT}`)
)

app.listen(PORT, () =>
    console.log(`Le serveur fonctionne sur le port : ${PORT}`)
)
//initialisation de la BDD
//initialization();
