const mongoose = require("mongoose");

const Role = mongoose.model(
    "Role",
    new mongoose.Schema({
        name: {
            type: String,
            require: true
        },
    })
);

module.exports = Role;

