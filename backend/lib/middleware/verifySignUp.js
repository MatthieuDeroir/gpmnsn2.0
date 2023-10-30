"use strict";

var db = require("../models/login");
var ROLES = db.ROLES;
var User = db.user;

var checkDuplicateUsername = function checkDuplicateUsername(req, res, next) {
    User.findOne({
        username: req.body.username
    }).exec(function (err, user) {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: "Failed! Username already in use!" });
            return;
        }
        next();
    });
};

var checkRolesExisted = function checkRolesExisted(req, res, next) {
    if (req.body.roles) {
        for (var i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: "Failed! Roles " + req.body.roles[i] + " does not exist!"
                });
                return;
            }
        }
    }
    next();
};

var verifySignUp = {
    checkDuplicateUsername: checkDuplicateUsername,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
//dummy