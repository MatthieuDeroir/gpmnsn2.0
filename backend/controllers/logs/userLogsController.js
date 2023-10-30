const mongoose = require('mongoose');

const { UserLogsSchema } = require('../../models/logs/userLogsModel');

const UserLogs = mongoose.model('UserLogs', UserLogsSchema);

export const addNewUserLogs = (req, res) => {
    let newUserLogs = new UserLogs(req.body);

    newUserLogs.save((err, UserLogs) => {
        if (err) {
            res.send(err);
        }
        res.json(UserLogs);
    })
}

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

import moment from 'moment';

export const getUserLogs = (req, res) => {
    console.log(req.query);
    console.log(req.query.startDate);
    // const startDate = moment(req.query.startDate, 'DD/MM/YY HH:mm:ss');
    const startDate = req.query.startDate;
    console.log("user logs startdate :" + startDate)
    UserLogs.find({
        date: {
            $gte: startDate,
        }
    }).limit(3000).sort({_id: -1}).exec((err, UserLogs) => {
        if (err) {
            res.send(err);
            console.log(err);
        }
        console.log(UserLogs.length);
        res.json(UserLogs);
    })
}

export const getUserLogsWithId = (req, res) => {
    UserLogs.findById(req.params.UserLogsId, (err, UserLogs) => {
        if (err) {
            res.send(err);
        }
        res.json(UserLogs);
    })
}

export const updateUserLogs = (req, res) => {
    UserLogs.findOneAndUpdate({ _id: req.params.UserLogsId }, req.body, { new: true }, (err, UserLogs) => {
        if (err) {
            res.send(err);
        }
        res.json(UserLogs);
    })
}

export const deleteUserLogs = (req, res) => {
    UserLogs.deleteOne({ _id: req.params.UserLogsId }, (err, UserLogs) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted UserLogs' });
    })
}

