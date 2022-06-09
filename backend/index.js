import express from 'express';
import mongoose from 'mongoose';
import bodyparser from "body-parser";
import bcrypt from 'bcryptjs';

const fileupload = require("express-fileupload");
import cors from 'cors';

import routes from './routes/appRoutes';

import path from "path";
import fs from "fs";

const app = express();
const PORT = 4000;

// disabling mention
app.disable('x-powered-by')

// mongo connexion
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://127.0.0.1/appDB`)


// file upload setup
app.use(fileupload());
app.use(express.static("medias"));

// bodyparser setup
app.use(bodyparser.urlencoded({extended: true}));
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
                res.status(500).send({message: "File upload failed", code: 500});
            } else {
                res.status(200).send({message: "File Uploaded", code: 200});
            }
        });
});

//routes
routes(app);

app.get('/', (req, res) =>
    res.send(`Le serveur G552 fonctionne sur le port : ${PORT}`)
)

app.listen(PORT, () =>
    console.log(`Le serveur G552 fonctionne sur le port : ${PORT}`)
)

// Fonction pour ajouter des roles dans la base de donnée

// initial();

// import Role from './models/login/roleModel'
//
// function initial() {
//     new Role({
//         name: "user"
//     }).save(err => {
//         if (err) {
//             console.log("error", err);
//         }
//         console.log("added user to role collection");
//     })
//     new Role({
//         name: "admin"
//     }).save(err => {
//         if (err) {
//             console.log("error", err);
//         }
//         console.log("added user to role collection");
//     })
// }