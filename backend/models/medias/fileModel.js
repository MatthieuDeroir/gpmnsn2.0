import mongoose from "mongoose";
import * as buffer from "buffer";

const Schema = mongoose.Schema;

export const FileSchema = new Schema({
    name:{
        type: String,
    },
    _user:{
        type: String,
    },
    type:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now()
    },
    path:{
        type: String,
    },
    duration:{
        type: Number
    },
    order:{
        type: Number
    },
    data:{

    }
})