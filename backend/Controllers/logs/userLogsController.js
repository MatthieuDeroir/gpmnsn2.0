const mongoose = require('mongoose');

const { UserLogsSchema } = require('../../Models/logs/userLogsModel');
const UserLogs = mongoose.model('UserLogs', UserLogsSchema);

const handleDatabaseOperation = require('../../Database/Operation');


export const addNewUserLogs = (req, res) => {
    handleDatabaseOperation(async () => {
        const newUserLogs = new UserLogs(req.body);
        return await newUserLogs.save();
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    });
};

export const getUserLogs = (req, res) => {
    handleDatabaseOperation(async () => {
        return await UserLogs.find({});
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};

export const getUserLogsWithId = (req, res) => {
    handleDatabaseOperation(async () => {
        return await UserLogs.findById(req.params.UserLogsId);
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};

export const updateUserLogs = (req, res) => {
    handleDatabaseOperation(async () => {
        return await UserLogs.findOneAndUpdate(
            { _id: req.params.UserLogsId },
            req.body,
            { new: true }
        );
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};

export const deleteUserLogs = (req, res) => {
    handleDatabaseOperation(async () => {
        await UserLogs.deleteOne({ _id: req.params.UserLogsId });
        return { message: 'Successfully deleted UserLogs' };
    }, res).then(r => {
        console.log(moment(r.createdAt).format('MMMM Do YYYY, h:mm:ss a'));
    })
};
