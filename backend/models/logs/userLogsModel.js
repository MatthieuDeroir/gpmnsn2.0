const mongoose = require("mongoose");

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
        date:{
            type: Date,
            default: Date.now()
        },
    })
);

module.exports = UserLogs;