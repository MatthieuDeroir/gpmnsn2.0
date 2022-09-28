const mongoose = require('mongoose');

const { PanelLogsSchema } = require('../../models/logs/panelLogsModel');

const PanelLogs = mongoose.model('PanelLogs', PanelLogsSchema);

export const addNewPanelLogs = (req, res) => {
    let newPanelLogs = new PanelLogs(req.body);

    newPanelLogs.save((err, PanelLogs) => {
        if (err) {
            res.send(err);
        }
        res.json(PanelLogs);
    })
}

export const getPanelLogs = (req, res) => {
    PanelLogs.find({}, (err, PanelLogs) => {
        if (err) {
            res.send(err);
        }
        res.json(PanelLogs);
    })
}

export const getPanelLogsWithId = (req, res) => {
    PanelLogs.findById(req.params.PanelLogsId, (err, PanelLogs) => {
        if (err) {
            res.send(err);
        }
        res.json(PanelLogs);
    })
}

export const updatePanelLogs = (req, res) => {
    PanelLogs.findOneAndUpdate({ _id: req.params.PanelLogsId }, req.body, { new: true }, (err, PanelLogs) => {
        if (err) {
            res.send(err);
        }
        res.json(PanelLogs);
    })
}

export const deletePanelLogs = (req, res) => {
    PanelLogs.deleteOne({ _id: req.params.PanelLogsId }, (err, PanelLogs) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted PanelLogs' });
    })
}

