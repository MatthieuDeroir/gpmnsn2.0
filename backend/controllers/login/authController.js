const config = require("../../authConfig");
const db = require("../../models/login");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
const fs = require('fs');
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const folderName = `../frontend/public/medias/${req.body.username}`;
    const user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.roles
    });
    user.save((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        if (req.body.roles) {
            Role.find(
                {
                    name: {$in: req.body.roles}
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({message: err});
                        return;
                    }
                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if (err) {
                            res.status(500).send({message: err});
                            return;
                        }
                        try {
                            if (!fs.existsSync(folderName)) {
                                fs.mkdirSync(folderName);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                        res.send({ message: "User was registered successfully !"});
                    });
                }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }
                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({message: err});
                        return;
                    }
                    try {
                        if (!fs.existsSync(folderName)) {
                            fs.mkdirSync(folderName);
                        }
                    } catch (err) {
                        console.error(err);
                    }
                    res.send({ message: "User was registered successfully !"});
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({message: err});
                console.log('server error')

                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not Found."});
                console.log('user not found')

            }


            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password,
        );

            if (!passwordIsValid){
                console.log('wrong password')
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            let token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // 24 heures,
                })
            console.log(`token logging success`)

            let authorities = [];
            for (let i = 0; i < user.roles.length; i++){
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
                }
            res.status(200).send({
                message: 'connexion réussie !',
                id: user._id,
                username: user.username,
                roles: authorities,
                accessToken: token
            });



            console.log(`success logging in ${user.username} : ${token}, ${user._id}`)

        });
};