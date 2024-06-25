import mongoose from "mongoose";

const PanelSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
        enum: [1, 2, 3] // ensures the index is between 1 and 3
    },
    name: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        required: true,
        default: false,
        description: "On or Off"
    },
    isOnline: {
        type: Boolean,
        required: true,
        default: false,
        description: "Connectivity status"
    },
    isDoorOpen: {
        type: Boolean,
        required: true,
        default: false,
        description: "Door open or not"
    },
    isSectorNominal: {
        type: Boolean,
        required: true,
        default: true,
        description: "Sector sensor status"
    },
    isAlimentationNominal: {
        type: Boolean,
        required: true,
        default: true,
        description: "Alimentation sensor status"
    },
    temperature: {
        type: Number,
        required: true,
        description: "Current CPU temperature"
    },
    hasBugs: {
        type: Boolean,
        required: true,
        default: false,
        description: "Flag indicating if there is a problem"
    },
    date: {
        type: Date,
        default: Date.now,
        description: "Universal datetime format"
    }
});

const Panel = mongoose.model("Panel", PanelSchema);
const PanelLogs = mongoose.model("PanelLogs", PanelSchema);

export { Panel, PanelLogs };
