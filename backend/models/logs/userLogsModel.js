const mongoose = require("mongoose");
const today = new Date()

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
            type: Date,
            default: Date.getDay() + "/" + (Date.getMonth() + 1) + "/" + Date.getFullYear() + " " + Date.getHours() + ":" + Date.getMinutes() + ":" + Date.getSeconds()
        },
    })
);

module.exports = UserLogs;
//dummy