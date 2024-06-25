const mongoose = require("mongoose");

const Instruction = mongoose.model(
    "Instruction",
    new mongoose.Schema({
        index: {
            type: Number,
            required: true,
            default: 0
        },
        name: {
            type: String,
            require: true,
        },
        instruction: {
            type: Boolean,
            required: true,
            description: "true = on, false = off"
        }
    })
);

module.exports = Instruction;
//dummy