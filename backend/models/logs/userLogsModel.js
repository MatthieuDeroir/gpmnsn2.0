const mongoose = require("mongoose");
var today = new Date()

const UserLogs = mongoose.model(
    "UserLogs",
    new mongoose.Schema({
        username: {
            type: String,
            require: true
        },
        message: {
            type: String,
            require: true,
        },
        date: {
            type: String,
            default: today.getDay() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        },
    })
);

module.exports = UserLogs;
//dummy