import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username:{
            type: String,
            require: true
        },

        password: {
            type: String,
            require: true
        },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]

    })
);

module.exports = User;

//dummy
