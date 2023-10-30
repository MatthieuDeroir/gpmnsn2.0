'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var mongoose = require('mongoose');

var _require = require("../../models/login/roleModel"),
    RoleSchema = _require.RoleSchema;

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

var addNewRole = exports.addNewRole = function addNewRole(req, res) {
    var newRole = new Role(req.body);

    newRole.save(function (err, Role) {
        if (err) {
            res.send(err);
        }
        res.json(Role);
    });
};

var getRoles = exports.getRoles = function getRoles(req, res) {
    Role.find({}, function (err, Role) {
        if (err) {
            res.send(err);
        }
        res.json(Role);
    });
};

var getRoleWithId = exports.getRoleWithId = function getRoleWithId(req, res) {
    Role.findById(req.params.RoleId, function (err, Role) {
        if (err) {
            res.send(err);
        }
        res.json(Role);
    });
};

var updateRole = exports.updateRole = function updateRole(req, res) {
    Role.findOneAndUpdate({ _id: req.params.RoleId }, function (err, Role) {
        console.log(Role);
        if (err) {
            res.send(err);
            return;
        }
        if (req.body.roles) {
            Role.find({
                name: { $in: req.body.roles }
            }, function (err, roles) {
                Role.roles = req.body.roles[0];
                console.log(Role.roles);
                res.json(Role);
            });
        }
    });
};

var deleteRole = exports.deleteRole = function deleteRole(req, res) {
    Role.remove({ _id: req.params.RoleId }, function (err, Role) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted Role' });
    });
};