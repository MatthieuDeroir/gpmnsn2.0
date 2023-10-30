"use strict";

var mongoose = require("mongoose");

var Instruction = mongoose.model("Instruction", new mongoose.Schema({
    index: {
        type: Number,
        require: true,
        default: 0
    },
    name: {
        type: String,
        require: true
    },
    instruction: {
        type: Boolean,
        require: true
    }
}));

module.exports = Instruction;
//dummy