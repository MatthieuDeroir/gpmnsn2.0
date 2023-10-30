'use strict';

var _initialization = require('./initialization');

var _appRoutes = require('./Routes/appRoutes');

var _appRoutes2 = _interopRequireDefault(_appRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var mongoose = require('mongoose'); //.Mongoose;
var bodyparser = require("body-parser");


var fileupload = require("express-fileupload");
var cors = require('cors');

var app = express();
var PORT = 4000;

// disabling mention
app.disable('x-powered-by');

// mongo connexion
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/portNS');

// mongoose.connect(
//     'mongodb://user:pass@myhost:27017/my-db?authSource=admin',
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     },
//     (err) => {
//         if (err) {
//             console.error('FAILED TO CONNECT TO MONGODB');
//             console.error(err);
//         } else {
//             console.log('CONNECTED TO MONGODB');
//             app.listen(80);
//         }
//     }
// );

// file upload setup
app.use(fileupload());
app.use(express.static("medias"));

// bodyparser setup
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// CORS setup
app.use(cors());

//POST
app.post("/upload", function (req, res) {
    var user = req.body.user;
    var newpath = __dirname + ('/../frontend/public/medias/' + user + '/');
    var file = req.files.file;
    var hashedName = req.body.fileName;
    var format = req.body.format;
    console.log(hashedName);
    file.mv('' + newpath + hashedName + '.' + format, function (err) {
        if (err) {
            res.status(500).send({ message: "File upload failed", code: 500 });
        } else {
            res.status(200).send({ message: "File Uploaded", code: 200 });
        }
    });
});

//Routes
(0, _appRoutes2.default)(app);

app.get('/', function (req, res) {
    return res.send('Le serveur fonctionne sur le port : ' + PORT);
});

app.listen(PORT, function () {
    return console.log('Le serveur fonctionne sur le port : ' + PORT);
});
//initialisation de la BDD
//initialization();