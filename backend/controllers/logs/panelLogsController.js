const mongoose = require('mongoose');
const moment = require('moment');

const {PanelLogsSchema} = require('../../Models/panel/PanelModel');
const PanelLogs = mongoose.model('PanelLogs', PanelLogsSchema);

const handleDatabaseOperation = require('../../Database/Operation');


export const addNewPanelLogs = (req, res) => {
    handleDatabaseOperation(async () => {
        const newPanelLogs = new PanelLogs(req.body);
        return await newPanelLogs.save();
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    });
};

export const getPanelLogs = (req, res) => {
    handleDatabaseOperation(async () => {
        return await PanelLogs.find({});
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};

export const getPanelLogsWithId = (req, res) => {
    handleDatabaseOperation(async () => {
        return await PanelLogs.findById(req.params.PanelLogsId);
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};

export const updatePanelLogs = (req, res) => {
    handleDatabaseOperation(async () => {
        return await PanelLogs.findOneAndUpdate(
            {_id: req.params.PanelLogsId},
            req.body,
            {new: true}
        );
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};

export const deletePanelLogs = (req, res) => {
    handleDatabaseOperation(async () => {
        await PanelLogs.deleteOne({_id: req.params.PanelLogsId});
        return {message: 'Successfully deleted PanelLogs'};
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};
