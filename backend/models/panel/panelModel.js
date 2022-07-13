const mongoose = require("mongoose");
var today = new Date()

const Panel = mongoose.model(
    "Panel",
    new mongoose.Schema({
        index: {
            type: Number,
            require: true,
        },
        name: {
            type: String,
            require: true
        },
        state: {
            type: Boolean,
            require: true,
        },

        door_1: {
            type: Boolean,
            require: true,
        },
        door_2: {
            type: Boolean,
            require: true,
        },
        online: {
            type: Boolean,
            require: true,
        },
        screen: {
            type: Boolean,
            require: true,
        },
        temperature: {
            type: Number,
            require: true,
        },
        bug: {
            type: Boolean,
            require: true,
        },
        date: {
            type: String,
            default: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        }
    })
);

module.exports = Panel;
//dummy