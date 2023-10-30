"use strict";

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var db = {};
db.mongoose = mongoose;
db.user = require("./userModel");
db.role = require("./roleModel");
db.ROLES = ["user", "admin", "superuser"];
module.exports = db;
//dummy