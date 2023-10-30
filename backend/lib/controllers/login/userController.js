'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var mongoose = require('mongoose');

var _require = require('../../models/login/userModel'),
    UserSchema = _require.UserSchema;

var _require2 = require("../../models/login/roleModel"),
    RoleSchema = _require2.RoleSchema;

var User = mongoose.model('User', UserSchema);
var Role = mongoose.model('Role', RoleSchema);

exports.allAccess = function (req, res) {
    res.status(200).send("Public Content");
};
exports.userBoard = function (req, res) {
    res.status(200).send("User Content");
};
exports.adminBoard = function (req, res) {
    res.status(200).send("Admin Content");
};
exports.superuserBoard = function (req, res) {
    res.status(200).send("Superuser Content");
};

var addNewUser = exports.addNewUser = function addNewUser(req, res) {
    var newUser = new User(req.body);

    newUser.save(function (err, User) {
        if (err) {
            res.send(err);
        }
        res.json(User);
    });
};

var getUsers = exports.getUsers = function getUsers(req, res) {
    User.find({}, function (err, User) {
        if (err) {
            res.send(err);
        }
        res.json(User);
    });
};

var getUserWithId = exports.getUserWithId = function getUserWithId(req, res) {
    User.findById(req.params.UserId, function (err, User) {
        if (err) {
            res.send(err);
        }
        res.json(User);
    });
};

var updateUser = exports.updateUser = function updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.UserId }, function (err, User) {
        console.log(User);
        if (err) {
            res.send(err);
            return;
        }
        if (req.body.roles) {
            Role.find({
                name: { $in: req.body.roles }
            }, function (err, roles) {
                User.roles = req.body.roles[0];
                console.log(User.roles);
                res.json(User);
            });
        }
    });
};

var deleteUser = exports.deleteUser = function deleteUser(req, res) {
    User.remove({ _id: req.params.UserId }, function (err, User) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted User' });
    });
};