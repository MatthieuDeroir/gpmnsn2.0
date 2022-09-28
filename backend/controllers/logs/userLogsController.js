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

export const getUserLogs = (req, res) => {
    UserLogs.find({}, (err, UserLogs) => {
        if (err) {
            res.send(err);
        }
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

