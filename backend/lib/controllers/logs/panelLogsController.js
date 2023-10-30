'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var mongoose = require('mongoose');

var moment = require('moment');

var _require = require('../../models/logs/panelLogsModel'),
    PanelLogsSchema = _require.PanelLogsSchema;

var PanelLogs = mongoose.model('PanelLogs', PanelLogsSchema);

var addNewPanelLogs = exports.addNewPanelLogs = function addNewPanelLogs(req, res) {
    var newPanelLogs = new PanelLogs(req.body);

    newPanelLogs.save(function (err, PanelLogs) {
        if (err) {
            res.send(err);
        }
        res.json(PanelLogs);
    });
};

// export const getPanelLogs = (req, res) => {
//     PanelLogs.find({
//         date: {
//             $gte: 0,
//         }
//     }).limit(30000).sort({_id: -1}).exec((err, PanelLogs) => {
//         if (err) {
//             res.send(err);
//             console.log(err);
//         }
//         console.log(PanelLogs.length);
//         res.json(PanelLogs);
//     })
// }
//
var getPanelLogs = exports.getPanelLogs = function getPanelLogs(req, res) {
    console.log(req.query);
    console.log(req.query.startDate);
    // const startDate = moment(req.query.startDate, 'DD/MM/YY HH:mm:ss');
    // change the startDate format which is DD/MM/YY HH:mm:ss to iso format
    var startDate = moment(req.query.startDate, 'DD/MM/YY HH:mm:ss').toISOString();
    // const startDate = moment(("20" + req.query.startDate.split('/')[2], req.query.startDate.split('/')[1], req.query.startDate.split('/')[0]), '')

    var endDate = req.query.endDate;
    console.log("panel logs startdate :" + startDate);
    PanelLogs.find({
        date: {
            $gte: startDate
        }
    }).limit(300000).sort({ _id: -1 }).exec(function (err, PanelLogs) {
        if (err) {
            res.send(err);
            console.log(err);
        }
        console.log(PanelLogs.length);
        res.json(PanelLogs);
    });
};

var getPanelLogsWithId = exports.getPanelLogsWithId = function getPanelLogsWithId(req, res) {
    PanelLogs.findById(req.params.PanelLogsId, function (err, PanelLogs) {
        if (err) {
            res.send(err);
        }
        res.json(PanelLogs);
    });
};

var updatePanelLogs = exports.updatePanelLogs = function updatePanelLogs(req, res) {
    PanelLogs.findOneAndUpdate({ _id: req.params.PanelLogsId }, req.body, { new: true }, function (err, PanelLogs) {
        if (err) {
            res.send(err);
        }
        res.json(PanelLogs);
    });
};

var deletePanelLogs = exports.deletePanelLogs = function deletePanelLogs(req, res) {
    PanelLogs.deleteOne({ _id: req.params.PanelLogsId }, function (err, PanelLogs) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted PanelLogs' });
    });
};

var deleteOldestLog = exports.deleteOldestLog = function deleteOldestLog(req, res) {
    PanelLogs.findOneAndDelete({}, { sort: { _id: 1 } }, function (err, PanelLog) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Oldest Log successfully deleted' });
    });
};