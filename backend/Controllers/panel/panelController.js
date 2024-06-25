const mongoose = require('mongoose');
const {PanelSchema} = require('../../Models/panel/panelModel');

const Panel = mongoose.model('Panel', PanelSchema);

const handleDatabaseOperation = require('../../Database/Operation');


export const addNewPanel = async (req, res) => {
    handleDatabaseOperation(async () => {
        const newPanel = new Panel(req.body);
        return await newPanel.save();
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};

export const getPanel = async (req, res) => {
    handleDatabaseOperation(async () => {
        return await Panel.find({});
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};

export const getPanelWithId = async (req, res) => {
    handleDatabaseOperation(async () => {
        return await Panel.findById(req.params.PanelId);
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};

export const updatePanel = async (req, res) => {
    handleDatabaseOperation(async () => {
        return await Panel.findOneAndUpdate(
            {_id: req.params.PanelId},
            req.body,
            {new: true}
        );
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};

export const deletePanel = async (req, res) => {
    handleDatabaseOperation(async () => {
        await Panel.deleteOne({_id: req.params.PanelId});
        return {message: 'Successfully deleted Panel'};
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};
