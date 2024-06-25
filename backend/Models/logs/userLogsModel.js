const mongoose = require("mongoose");
var today = new Date()

const UserLogsSchema = mongoose.model(
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
            default: Date.now,
            description: "Universal datetime format"
        }
    })
);

module.exports = UserLogsSchema;
//dummy