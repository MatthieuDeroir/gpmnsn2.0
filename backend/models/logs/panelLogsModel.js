const mongoose = require("mongoose");

const PanelLogs = mongoose.model(
    "PanelLogs",
    new mongoose.Schema({
        index: {
            type: Number,
            require: true,
        },
        name: {
            type: String,
            require: true
        },
        isOpen: {
            type: Boolean,
            require: true,
        },
        power: {
            type: Boolean,
            require: true,
        },
        temperature: {
            type: Number,
            require: true,
        },
        screen: {
            type: Boolean,
            require: true,
        },
        date: {
            type: Date,
            default: Date.now()
        },
    })
);

module.exports = PanelLogs;