const db = require("../models/login")
const ROLES = db.ROLES
const User = db.user;

const checkDuplicateUsername = (req, res, next) => {
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
            if (user) {
                res.status(400).send({message: "Failed! Username already in use!"})
                return;
            }
            next();
        }
    )
}

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Roles ${req.body.roles[i]} does not exist!`
                });
                return;
            }
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicateUsername,
    checkRolesExisted
}

module.exports = verifySignUp;
