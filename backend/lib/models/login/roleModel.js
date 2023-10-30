"use strict";

var mongoose = require("mongoose");

var Role = mongoose.model("Role", new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
}));

module.exports = Role;

//dummy