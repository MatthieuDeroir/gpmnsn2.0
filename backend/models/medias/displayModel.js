import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Display = mongoose.model(
    "Display",
    new mongoose.Schema({
        Ordre: {
            "Type": String,
            "Nom": String,
        },
        date:{
            type: Date,
            default: Date.now()
        },
        events: [],
    })
);

module.exports = Display;