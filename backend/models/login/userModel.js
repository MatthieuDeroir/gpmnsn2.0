import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        password: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]

    })
);

module.exports = User;



