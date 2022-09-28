const mongoose = require('mongoose');

const { PanelSchema } = require('../../models/panel/panelModel');

const Panel = mongoose.model('Panel', PanelSchema);

export const addNewPanel = (req, res) => {
    let newPanel = new Panel(req.body);

    newPanel.save((err, Panel) => {
        if (err) {
            res.send(err);
        }
        res.json(Panel);
    })
}

export const getPanel = (req, res) => {
    Panel.find({}, (err, Panel) => {
        if (err) {
            res.send(err);
        }
        res.json(Panel);
    })
}

export const getPanelWithId = (req, res) => {
    Panel.findById(req.params.PanelId, (err, Panel) => {
        if (err) {
            res.send(err);
        }
        res.json(Panel);
    })
}

export const updatePanel = (req, res) => {
    Panel.findOneAndUpdate({ _id: req.params.PanelId }, req.body, { new: true }, (err, Panel) => {
        if (err) {
            res.send(err);
        }
        res.json(Panel);
    })
}

export const deletePanel = (req, res) => {
    Panel.deleteOne({ _id: req.params.PanelId }, (err, Panel) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted Panel' });
    })
}

