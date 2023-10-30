'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var mongoose = require('mongoose');

var _require = require('../../models/panel/panelModel'),
    PanelSchema = _require.PanelSchema;

var Panel = mongoose.model('Panel', PanelSchema);

var addNewPanel = exports.addNewPanel = function addNewPanel(req, res) {
    var newPanel = new Panel(req.body);

    newPanel.save(function (err, Panel) {
        if (err) {
            res.send(err);
        }
        res.json(Panel);
    });
};

var getPanel = exports.getPanel = function getPanel(req, res) {
    Panel.find({}, function (err, Panel) {
        if (err) {
            res.send(err);
        }
        res.json(Panel);
    });
};

var getPanelWithId = exports.getPanelWithId = function getPanelWithId(req, res) {
    Panel.findById(req.params.PanelId, function (err, Panel) {
        if (err) {
            res.send(err);
        }
        res.json(Panel);
    });
};

var updatePanel = exports.updatePanel = function updatePanel(req, res) {
    Panel.findOneAndUpdate({ _id: req.params.PanelId }, req.body, { new: true }, function (err, Panel) {
        if (err) {
            res.send(err);
        }
        res.json(Panel);
    });
};

var deletePanel = exports.deletePanel = function deletePanel(req, res) {
    Panel.deleteOne({ _id: req.params.PanelId }, function (err, Panel) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted Panel' });
    });
};