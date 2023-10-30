'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deleteUserLogs = exports.updateUserLogs = exports.getUserLogsWithId = exports.getUserLogs = exports.addNewUserLogs = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');

var _require = require('../../models/logs/userLogsModel'),
    UserLogsSchema = _require.UserLogsSchema;

var UserLogs = mongoose.model('UserLogs', UserLogsSchema);

var addNewUserLogs = exports.addNewUserLogs = function addNewUserLogs(req, res) {
    var newUserLogs = new UserLogs(req.body);

    newUserLogs.save(function (err, UserLogs) {
        if (err) {
            res.send(err);
        }
        res.json(UserLogs);
    });
};

// export const getUserLogs = (req, res) => {
//     UserLogs.find({}, (err, UserLogs) => {
//         if (err) {
//             res.send(err);
//         }
//         res.json(UserLogs);
//     })
// }

// export const getUserLogs = (req, res) => {
//     let startDateStr = req.query.startDate;
//     let endDateStr = req.query.endDate;
//     console.log(startDateStr, endDateStr);
//     let startDate = new Date(startDateStr.substring(11) + "T" + startDateStr.substring(0, 8) + "Z");
//     let endDate = new Date(endDateStr.substring(11) + "T" + endDateStr.substring(0, 8) + "Z");
//     console.log(startDate, endDate);
//     UserLogs.find({ createdAt: {
//             $gte: startDate,
//             $lt: endDate
//         }}).sort({_id:-1}).exec((err, PanelLogs) => {
//         if (err) {
//             res.send(err);
//         }
//         res.json(PanelLogs);
//     })
// }

// export const getUserLogs = (req, res) => {
//
//     UserLogs.find({}).limit(3000).sort({_id:-1}).exec((err, UserLogs) => {
//         if (err) {
//             res.send(err);
//         }
//         console.log(UserLogs.length);
//         res.json(UserLogs);
//     })
// }

var getUserLogs = exports.getUserLogs = function getUserLogs(req, res) {
    console.log(req.query);
    console.log(req.query.startDate);
    // const startDate = moment(req.query.startDate, 'DD/MM/YY HH:mm:ss');
    var startDate = req.query.startDate;
    console.log("user logs startdate :" + startDate);
    UserLogs.find({
        date: {
            $gte: startDate
        }
    }).limit(3000).sort({ _id: -1 }).exec(function (err, UserLogs) {
        if (err) {
            res.send(err);
            console.log(err);
        }
        console.log(UserLogs.length);
        res.json(UserLogs);
    });
};

var getUserLogsWithId = exports.getUserLogsWithId = function getUserLogsWithId(req, res) {
    UserLogs.findById(req.params.UserLogsId, function (err, UserLogs) {
        if (err) {
            res.send(err);
        }
        res.json(UserLogs);
    });
};

var updateUserLogs = exports.updateUserLogs = function updateUserLogs(req, res) {
    UserLogs.findOneAndUpdate({ _id: req.params.UserLogsId }, req.body, { new: true }, function (err, UserLogs) {
        if (err) {
            res.send(err);
        }
        res.json(UserLogs);
    });
};

var deleteUserLogs = exports.deleteUserLogs = function deleteUserLogs(req, res) {
    UserLogs.deleteOne({ _id: req.params.UserLogsId }, function (err, UserLogs) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted UserLogs' });
    });
};