const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require("./userModel")
db.role = require("./roleModel");
db.ROLES = ["Monitoring", "Work", "Maintenance"]
module.exports = db;
//dummy