"use strict";

var jwt = require("jsonwebtoken");
var config = require("../authConfig");
var db = require("../models/login");
var User = db.user;

var verifyToken = function verifyToken(req, res, next) {
    var token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};
var isAdmin = function isAdmin(req, res, next) {
    User.findById(req.userId).exec(function (err, user) {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Role.find({
            _id: { $in: user.roles }
        }, function (err, roles) {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }
            res.status(403).send({ message: "Require Admin Role !" });
        });
    });
};
//dummy


var authentication = {
    verifyToken: verifyToken,
    isAdmin: isAdmin
};
module.exports = authentication;