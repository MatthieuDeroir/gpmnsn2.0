const mongoose = require("mongoose");

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

        isOpen: {
            type: Boolean,
            require: true,
        },
        power: {
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
        bug : {
            type: Boolean,
            require: true,
        }


    })
);

module.exports = Panel;