"use strict";

var config = require("../../authConfig");
var db = require("../../models/login");
var User = db.user;
var Role = db.role;
var jwt = require("jsonwebtoken");
var fs = require('fs');
var bcrypt = require("bcryptjs");

exports.signup = function (req, res) {
    var folderName = "../frontend/public/medias/" + req.body.username;
    var user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.roles
    });
    user.save(function (err, user) {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (req.body.roles) {
            Role.find({
                name: { $in: req.body.roles }
            }, function (err, roles) {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                user.roles = roles.map(function (role) {
                    return role._id;
                });
                user.save(function (err) {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    try {
                        if (!fs.existsSync(folderName)) {
                            fs.mkdirSync(folderName);
                        }
                    } catch (err) {
                        console.error(err);
                    }
                    res.send({ message: "User was registered successfully !" });
                });
            });
        } else {
            Role.findOne({ name: "user" }, function (err, role) {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                user.roles = [role._id];
                user.save(function (err) {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    try {
                        if (!fs.existsSync(folderName)) {
                            fs.mkdirSync(folderName);
                        }
                    } catch (err) {
                        console.error(err);
                    }
                    res.send({ message: "User was registered successfully !" });
                });
            });
        }
    });
};

exports.signin = function (req, res) {
    User.findOne({
        username: req.body.username
    }).populate("roles", "-__v").exec(function (err, user) {
        if (err) {
            console.log(err);
            console.log(req.body);
            res.status(500).send({ message: err });
            console.log('server error');
            return;
        }

        if (!user) {
            return res.status(404).send({ message: "User Not Found." });
            console.log('user not found');
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            console.log('wrong password');
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // 24 heures,
        });
        console.log("token logging success");

        var authorities = [];
        for (var i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
            message: 'connexion réussie !',
            id: user._id,
            username: user.username,
            roles: authorities,
            accessToken: token
        });

        console.log("success logging in " + user.username + " : " + token + ", " + user._id);
    });
};