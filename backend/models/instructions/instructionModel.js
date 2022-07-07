const mongoose = require("mongoose");

const Instruction = mongoose.model(
    "Instruction",
    new mongoose.Schema({
        index: {
            type: Number,
            require: true,
            default: 0
        },
        name: {
            type: String,
            require: true,
        },
        instruction: {
            type: Boolean,
            require: true,
        }
    })
);

module.exports = Instruction;
//dummy